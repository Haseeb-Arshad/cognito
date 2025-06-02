// Supabase Edge Function: generate-alert
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Create a Supabase client with the Auth context of the function
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  try {
    // Parse request
    const { insightId, profileId, severity, title } = await req.json();
    
    // Validate required parameters
    if (!insightId || !profileId || !severity || !title) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required parameters",
          details: "insightId, profileId, severity, and title are required"
        }),
        { headers: { "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    console.log(`Generating alert for insight ${insightId} with severity ${severity}`);
    
    // Get insight details
    const { data: insight, error: insightError } = await supabaseClient
      .from("ai_processed_insights")
      .select("id, summary, key_insights, is_crisis, is_opportunity")
      .eq("id", insightId)
      .single();
    
    if (insightError || !insight) {
      return new Response(
        JSON.stringify({ error: `Insight not found: ${insightError?.message}` }),
        { headers: { "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Get profile details
    const { data: profile, error: profileError } = await supabaseClient
      .from("monitoring_profiles")
      .select("id, name, user_id, alert_config")
      .eq("id", profileId)
      .single();
    
    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ error: `Profile not found: ${profileError?.message}` }),
        { headers: { "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Create alert record
    const { data: alert, error: alertError } = await supabaseClient
      .from("alerts")
      .insert({
        profile_id: profileId,
        insight_id: insightId,
        severity,
        title,
        status: "new",
        user_notes: null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (alertError) {
      return new Response(
        JSON.stringify({ error: `Error creating alert: ${alertError.message}` }),
        { headers: { "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log(`Created alert with ID: ${alert.id}`);
    
    // Send realtime notification if enabled in alert_config
    if (profile.alert_config?.notification_channels?.includes("in_app")) {
      console.log(`Sending realtime notification to user ${profile.user_id}`);
      
      // Send notification via Supabase Realtime
      await supabaseClient
        .from("realtime_notifications")
        .insert({
          user_id: profile.user_id,
          type: "alert",
          payload: {
            alertId: alert.id,
            severity,
            title,
            profileId,
            profileName: profile.name,
            timestamp: new Date().toISOString()
          },
          read: false
        });
      
      // Broadcast to client channel
      const broadcastResult = await supabaseClient
        .channel(`user:${profile.user_id}`)
        .send({
          type: "broadcast",
          event: "new_alert",
          payload: {
            alertId: alert.id,
            severity,
            title,
            profileId,
            profileName: profile.name,
            timestamp: new Date().toISOString()
          }
        });
      
      console.log(`Broadcast result:`, broadcastResult);
    }
    
    // Send email notification if enabled in alert_config
    if (profile.alert_config?.notification_channels?.includes("email")) {
      console.log(`Email notification would be sent to user ${profile.user_id}`);
      
      // In a production implementation, you would integrate with an email service
      // such as SendGrid, AWS SES, or similar to send the email notification
      
      // Email notification stub - for demonstration purposes
      const emailData = {
        to: "user@example.com", // In production, fetch this from user profile
        subject: `[${severity.toUpperCase()}] ${title}`,
        body: `
          <h1>Alert: ${title}</h1>
          <p><strong>Severity:</strong> ${severity}</p>
          <p><strong>Profile:</strong> ${profile.name}</p>
          <p><strong>Summary:</strong> ${insight.summary}</p>
          <h2>Key Insights:</h2>
          <ul>
            ${insight.key_insights.map((insight: string) => `<li>${insight}</li>`).join("")}
          </ul>
          <p>
            <a href="${Deno.env.get("FRONTEND_URL") ?? "https://app.cognito-monitoring.com"}/app/alerts/${alert.id}">
              View Alert
            </a>
          </p>
        `
      };
      
      console.log("Email would be sent with data:", emailData);
      
      // In production, add actual email sending code here
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Alert generated successfully",
        alertId: alert.id,
        notificationSent: profile.alert_config?.notification_channels?.includes("in_app")
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-alert function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: (error instanceof Error) ? error.message : String(error)
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
