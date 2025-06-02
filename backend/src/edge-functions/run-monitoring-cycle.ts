// Supabase Edge Function: run-monitoring-cycle
// This function is triggered by a scheduled job to run monitoring cycles for active profiles

import { monitoringProfiles, dataSources } from '../db/models';
import { discoverNewSources } from './discover-new-sources';
import { scrapeSourceContent } from './scrape-source-content';

// Main function to run a monitoring cycle
export async function run_monitoring_cycle() {
  try {
    // 1. Get all active monitoring profiles due for a run
    const profiles = await monitoringProfiles.getDueForMonitoring();
    console.log(`Running monitoring cycle for ${profiles.length} profiles`);

    // 2. Process each profile
    for (const profile of profiles) {
      console.log(`Processing profile: ${profile.id} - ${profile.name}`);
      
      // 3. Check if auto-discover is enabled
      if (profile.source_config.auto_discover_sources) {
        try {
          // 4. Discover new sources based on keywords
          await discoverNewSources({
            profileId: profile.id,
            discoveryKeywords: profile.source_config.discovery_keywords,
            excludedUrls: profile.source_config.excluded_urls
          });
        } catch (error) {
          console.error(`Error discovering sources for profile ${profile.id}:`, error);
          // Continue with other tasks even if discovery fails
        }
      }

      // 5. Get all active data sources for this profile that are due for scraping
      const sources = await dataSources.getByProfileId(profile.id);
      const dueSources = sources.filter(source => 
        source.status === 'active' && 
        (!source.next_scrape_due_at || new Date(source.next_scrape_due_at) <= new Date())
      );
      
      console.log(`Found ${dueSources.length} sources due for scraping`);

      // 6. Process each source
      for (const source of dueSources) {
        try {
          // 7. Scrape content from the source
          await scrapeSourceContent({
            dataSourceId: source.id,
            profileId: profile.id,
            url: source.url,
            keywords: profile.keywords
          });
        } catch (error) {
          console.error(`Error scraping source ${source.id} (${source.url}):`, error);
          // Continue with other sources even if one fails
          
          // Update source status if it's unreachable
          if ((error as Error).message.includes('unreachable') || 
              (error as Error).message.includes('blocked') || 
              (error as Error).message.includes('access denied')) {
            await dataSources.update(source.id, {
              status: 'unreachable',
              next_scrape_due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Try again in 24 hours
            });
          }
        }
      }

      // 8. Update the profile's last run timestamp
      await monitoringProfiles.update(profile.id, {
        last_run_at: new Date().toISOString()
      });
    }

    return { success: true, message: `Completed monitoring cycle for ${profiles.length} profiles` };
  } catch (error) {
    console.error('Error in monitoring cycle:', error);
    return { success: false, error: (error as Error).message };
  }
}

// Export handler for Supabase Edge Function
export default async function handler(req: Request) {
  try {
    const result = await run_monitoring_cycle();
    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
      status: result.success ? 200 : 500
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}
