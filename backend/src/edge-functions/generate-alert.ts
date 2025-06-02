// Supabase Edge Function: generate-alert
// This function generates alerts based on AI insights

import { alerts, insights, monitoringProfiles } from '../db/models';
import { AlertSeverity } from '../types';
import { supabaseClient } from '../db/supabase';

interface GenerateAlertParams {
  insightId: string;
  profileId: string;
  severity: AlertSeverity;
  title: string;
}

export async function generateAlert(params: GenerateAlertParams) {
  const { insightId, profileId, severity, title } = params;
  
  try {
    // 1. Get the insight to verify it exists
    const insight = await insights.getById(insightId);
    if (!insight) {
      throw new Error(`Insight not found: ${insightId}`);
    }
    
    // 2. Get the monitoring profile to access notification settings
    const profile = await monitoringProfiles.getById(profileId);
    if (!profile) {
      throw new Error(`Profile not found: ${profileId}`);
    }
    
    console.log(`Generating ${severity} alert for insight ${insightId}`);
    
    // 3. Create the alert
    const alert = await alerts.create({
      profile_id: profileId,
      insight_id: insightId,
      severity,
      title,
      status: 'new',
      user_notes: null
    });
    
    console.log(`Created alert: ${alert.id}`);
    
    // 4. Send realtime notification if enabled
    if (profile.alert_config.notification_channels.includes('in_app')) {
      try {
        // Broadcast to user-specific channel
        await supabaseClient.channel(`user:${profile.user_id}`)
          .send({
            type: 'broadcast',
            event: 'new_alert',
            payload: {
              alertId: alert.id,
              severity,
              title,
              profileId,
              profileName: profile.name,
              timestamp: new Date().toISOString()
            }
          });
        
        console.log(`Sent realtime notification for alert ${alert.id}`);
      } catch (error) {
        console.error('Error sending realtime notification:', error);
        // Continue even if realtime notification fails
      }
    }
    
    // 5. Send email notification if enabled
    if (profile.alert_config.notification_channels.includes('email')) {
      // In a real implementation, you would call an email service here
      console.log(`Email notification would be sent for alert ${alert.id}`);
      
      // Simplified example of what this might look like:
      /*
      await emailService.sendAlertEmail({
        to: userEmail,
        subject: `${severity.toUpperCase()} Alert: ${title}`,
        body: `
          A new ${severity} alert has been detected for your monitoring profile "${profile.name}".
          
          ${title}
          
          View details: https://your-app-url.com/app/alerts/${alert.id}
        `
      });
      */
    }
    
    return {
      success: true,
      message: 'Alert generated successfully',
      alertId: alert.id
    };
  } catch (error) {
    console.error('Error generating alert:', error);
    throw error;
  }
}

// Export handler for Supabase Edge Function
export default async function handler(req: Request) {
  try {
    // Parse request body
    const { insightId, profileId, severity, title } = await req.json();
    
    if (!insightId || !profileId || !severity || !title) {
      return new Response(JSON.stringify({ 
        error: 'Invalid request. Required: insightId, profileId, severity, title' 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400
      });
    }
    
    const result = await generateAlert({
      insightId,
      profileId,
      severity: severity as AlertSeverity,
      title
    });
    
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
