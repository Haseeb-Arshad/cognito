// Supabase Edge Function: run-monitoring-cycle
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Create a Supabase client with the Auth context of the function
const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

serve(async (req) => {
  try {
    // This is a cron-triggered function that runs on a schedule
    // You can also invoke it manually from the Supabase dashboard

    console.log("Running monitoring cycle...");

    // Fetch profiles due for monitoring
    const { data: profiles, error: profilesError } = await supabaseClient
      .from("monitoring_profiles")
      .select("id, name, keywords, frequency_hours, last_run_at, source_discovery_enabled")
      .lte("next_run_at", new Date().toISOString());

    if (profilesError) {
      throw new Error(`Error fetching profiles: ${profilesError.message}`);
    }

    console.log(`Found ${profiles.length} profiles to process`);

    // Process each profile
    for (const profile of profiles) {
      try {
        console.log(`Processing profile: ${profile.name} (${profile.id})`);

        // Run source discovery if enabled
        if (profile.source_discovery_enabled) {
          // Call discover-new-sources function
          const discoverResp = await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/discover-new-sources`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
              },
              body: JSON.stringify({ profileId: profile.id }),
            }
          );

          if (!discoverResp.ok) {
            console.error(`Error discovering sources for profile ${profile.id}: ${await discoverResp.text()}`);
          }
        }

        // Fetch active sources for this profile
        const { data: sources, error: sourcesError } = await supabaseClient
          .from("data_sources")
          .select("id, name, url, source_type, scrape_config, frequency_hours, last_scraped_at")
          .eq("profile_id", profile.id)
          .eq("enabled", true)
          .lte("next_scrape_at", new Date().toISOString());

        if (sourcesError) {
          throw new Error(`Error fetching sources: ${sourcesError.message}`);
        }

        console.log(`Found ${sources.length} sources to scrape for profile ${profile.name}`);

        // Process each source
        for (const source of sources) {
          try {
            // Call scrape-source-content function
            const scrapeResp = await fetch(
              `${Deno.env.get("SUPABASE_URL")}/functions/v1/scrape-source-content`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
                },
                body: JSON.stringify({ sourceId: source.id }),
              }
            );

            if (!scrapeResp.ok) {
              console.error(`Error scraping source ${source.id}: ${await scrapeResp.text()}`);
            }
          } catch (sourceError) {
            console.error(`Error processing source ${source.id}: ${sourceError}`);
            // Continue with next source
          }
        }

        // Update profile's last_run_at and next_run_at
        const nextRunAt = new Date();
        nextRunAt.setHours(nextRunAt.getHours() + profile.frequency_hours);

        await supabaseClient
          .from("monitoring_profiles")
          .update({
            last_run_at: new Date().toISOString(),
            next_run_at: nextRunAt.toISOString(),
          })
          .eq("id", profile.id);

      } catch (profileError) {
        console.error(`Error processing profile ${profile.id}: ${profileError}`);
        // Continue with next profile
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${profiles.length} profiles`,
        timestamp: new Date().toISOString(),
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in run-monitoring-cycle function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: (error instanceof Error) ? error.message : String(error),
      }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});
