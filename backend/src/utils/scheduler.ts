import { CronJob } from 'cron';
import { run_monitoring_cycle } from '../edge-functions/run-monitoring-cycle';
import { rawContent } from '../db/models';
import { processContentWithAI } from '../edge-functions/process-content-with-ai';

/**
 * Initializes scheduled jobs for the application
 */
export function initializeScheduledJobs() {
  // Schedule monitoring cycle every 15 minutes
  const monitoringJob = new CronJob(
    '*/15 * * * *', // Cron expression: every 15 minutes
    async () => {
      console.log('Running scheduled monitoring cycle...');
      try {
        await run_monitoring_cycle();
      } catch (error) {
        console.error('Error in scheduled monitoring job:', error);
      }
    },
    null, // onComplete
    false, // start
    'UTC' // timezone
  );

  // Schedule AI processing for unprocessed content every 5 minutes
  const aiProcessingJob = new CronJob(
    '*/5 * * * *', // Cron expression: every 5 minutes
    async () => {
      console.log('Processing unprocessed content with AI...');
      try {
        // Get unprocessed content
        const unprocessedContent = await rawContent.getUnprocessed(10);
        
        if (unprocessedContent.length === 0) {
          console.log('No unprocessed content found.');
          return;
        }
        
        console.log(`Found ${unprocessedContent.length} items to process.`);
        
        // Process each item
        for (const content of unprocessedContent) {
          try {
            await processContentWithAI({
              rawContentId: content.id,
              generateEmbedding: true
            });
          } catch (error) {
            console.error(`Error processing content ${content.id}:`, error);
            // Continue with next item
          }
        }
      } catch (error) {
        console.error('Error in AI processing job:', error);
      }
    },
    null, // onComplete
    false, // start
    'UTC' // timezone
  );

  // Start jobs
  monitoringJob.start();
  aiProcessingJob.start();

  console.log('Scheduled jobs initialized.');

  // Return job references in case we need to stop them later
  return {
    monitoringJob,
    aiProcessingJob
  };
}
