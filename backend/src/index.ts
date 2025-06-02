import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { supabaseClient, initializeStorage } from './db/supabase';
import * as models from './db/models';
import dotenv from 'dotenv';
import { run_monitoring_cycle } from './edge-functions/run-monitoring-cycle';
import { initializeScheduledJobs } from './utils/scheduler';
import { logger } from './utils/logger';
import { Context } from './types/hono';

// Initialize environment variables
dotenv.config();

// Create Hono app with Context type
const app = new Hono<{ Variables: {}; Bindings: {}; }>();

// Middleware
app.use(async (c: Context, next) => {
  logger.info(`${c.req.method} ${c.req.url}`);
  await next();
  logger.debug(`Response status: ${c.res.status}`);
});
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://cognito-app.vercel.app'],
  credentials: true,
}));

// JWT authentication middleware
const authenticateJWT = jwt({
  secret: process.env.SUPABASE_JWT_SECRET || 'your-jwt-secret-for-local-dev',
});

// Health check route
app.get('/', (c: Context) => {
  return c.json({ 
    status: 'ok', 
    message: 'Cognito API server is running',
    version: '1.0.0'
  });
});

// Auth routes
const auth = app.group('/auth');

auth.post('/login', async (c: Context) => {
  const { email, password } = await c.req.json();
  
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    return c.json({ error: error.message }, 401);
  }
  
  return c.json(data);
});

auth.post('/signup', async (c: Context) => {
  const { email, password } = await c.req.json();
  
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });
  
  if (error) {
    return c.json({ error: error.message }, 400);
  }
  
  return c.json(data);
});

auth.post('/logout', async (c: Context) => {
  const { error } = await supabaseClient.auth.signOut();
  
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  
  return c.json({ success: true });
});

// API routes - protected by JWT
const api = app.group('/api', authenticateJWT);

// Monitoring profiles endpoints
api.get('/profiles', async (c: Context) => {
  try {
    const userId = c.get('jwtPayload').sub;
    const profiles = await models.monitoringProfiles.getByUserId(userId);
    return c.json(profiles);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.get('/profiles/:id', async (c: Context) => {
  try {
    const id = c.req.param('id');
    const profile = await models.monitoringProfiles.getById(id);
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404);
    }
    
    return c.json(profile);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.post('/profiles', async (c: Context) => {
  try {
    const userId = c.get('jwtPayload').sub;
    const data = await c.req.json();
    
    const profile = await models.monitoringProfiles.create({
      ...data,
      user_id: userId,
    });
    
    return c.json(profile, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.put('/profiles/:id', async (c: Context) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    
    const profile = await models.monitoringProfiles.update(id, data);
    
    return c.json(profile);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.delete('/profiles/:id', async (c: Context) => {
  try {
    const id = c.req.param('id');
    await models.monitoringProfiles.delete(id);
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// Data sources endpoints
api.get('/profiles/:profileId/sources', async (c: Context) => {
  try {
    const profileId = c.req.param('profileId');
    const sources = await models.dataSources.getByProfileId(profileId);
    
    return c.json(sources);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.post('/profiles/:profileId/sources', async (c: Context) => {
  try {
    const profileId = c.req.param('profileId');
    const data = await c.req.json();
    
    const source = await models.dataSources.create({
      ...data,
      profile_id: profileId,
    });
    
    return c.json(source, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.put('/sources/:id', async (c: Context) => {
  try {
    const id = c.req.param('id');
    const data = await c.req.json();
    
    const source = await models.dataSources.update(id, data);
    
    return c.json(source);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.delete('/sources/:id', async (c: Context) => {
  try {
    const id = c.req.param('id');
    await models.dataSources.delete(id);
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// Insights endpoints
api.get('/profiles/:profileId/insights', async (c: Context) => {
  try {
    const profileId = c.req.param('profileId');
    const limit = parseInt(c.req.query('limit') || '20');
    
    const insightList = await models.insights.getByProfileId(profileId, limit);
    
    return c.json(insightList);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.get('/insights/:id', async (c: Context) => {
  try {
    const id = c.req.param('id');
    const insight = await models.insights.getById(id);
    
    if (!insight) {
      return c.json({ error: 'Insight not found' }, 404);
    }
    
    return c.json(insight);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// Alerts endpoints
api.get('/profiles/:profileId/alerts', async (c: Context) => {
  try {
    const profileId = c.req.param('profileId');
    const status = c.req.query('status') as any;
    const limit = parseInt(c.req.query('limit') || '20');
    
    const alertList = await models.alerts.getByProfileId(profileId, status, limit);
    
    return c.json(alertList);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.get('/alerts/:id', async (c: Context) => {
  try {
    const id = c.req.param('id');
    const alert = await models.alerts.getById(id);
    
    if (!alert) {
      return c.json({ error: 'Alert not found' }, 404);
    }
    
    return c.json(alert);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

api.put('/alerts/:id/status', async (c: Context) => {
  try {
    const id = c.req.param('id');
    const { status, userNotes } = await c.req.json();
    
    const alert = await models.alerts.updateStatus(id, status, userNotes);
    
    return c.json(alert);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// Dashboard endpoints
api.get('/profiles/:profileId/dashboard', async (c: Context) => {
  try {
    const profileId = c.req.param('profileId');
    
    // Get alert counts by severity
    const alertCounts = await models.alerts.getCountsBySeverity(profileId);
    
    // Get recent alerts
    const recentAlerts = await models.alerts.getByProfileId(profileId, undefined, 5);
    
    // Get recent insights
    const recentInsights = await models.insights.getByProfileId(profileId, 5);
    
    return c.json({
      alertCounts,
      recentAlerts,
      recentInsights
    });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// Manual trigger for monitoring cycle (admin only)
api.post('/admin/run-monitoring', async (c: Context) => {
  try {
    // In a real implementation, you would check for admin privileges
    const result = await run_monitoring_cycle();
    
    return c.json(result);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// Initialize storage buckets on startup
initializeStorage().catch(error => logger.error('Failed to initialize storage buckets', error));

// Start scheduled jobs in production but not during development hot reloads
let scheduledJobs: any;
if (process.env.NODE_ENV === 'production') {
  scheduledJobs = initializeScheduledJobs();
  logger.info('Scheduled jobs initialized in production mode');
} else {
  logger.info('Scheduled jobs not initialized in development mode');
}

// Graceful shutdown
const shutdown = () => {
  logger.info('Shutting down server...');
  
  // Stop scheduled jobs if running
  if (scheduledJobs) {
    scheduledJobs.monitoringJob.stop();
    scheduledJobs.aiProcessingJob.stop();
    logger.info('Scheduled jobs stopped');
  }
  
  // Any other cleanup
  
  logger.info('Server shutdown complete');
  process.exit(0);
};

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start server
const port = parseInt(process.env.PORT || '3001');
logger.info(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
