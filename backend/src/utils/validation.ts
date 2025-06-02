import { z } from 'zod';
import { Context } from '../types/hono';

/**
 * Common validation schemas for request data
 */

// Monitoring profile schema
export const MonitoringProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  keywords: z.array(z.string()).min(1, "At least one keyword is required"),
  frequency_hours: z.number().min(1).max(168),
  source_discovery_enabled: z.boolean().default(true),
  alert_config: z.object({
    sensitivity: z.enum(['low', 'medium', 'high']),
    notification_channels: z.array(z.enum(['in_app', 'email'])).min(1)
  })
});

// Data source schema
export const DataSourceSchema = z.object({
  profile_id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL format"),
  source_type: z.enum(['website', 'rss', 'twitter', 'reddit', 'linkedin', 'news']),
  scrape_config: z.object({
    selectors: z.array(z.string()).optional(),
    capture_screenshot: z.boolean().default(false),
    save_html: z.boolean().default(true)
  }).optional(),
  frequency_hours: z.number().min(1).max(168),
  enabled: z.boolean().default(true)
});

// Alert status update schema
export const AlertStatusUpdateSchema = z.object({
  status: z.enum(['new', 'acknowledged', 'resolved', 'dismissed']),
  userNotes: z.string().optional()
});

/**
 * Validation middleware factory
 * Creates a middleware that validates request body against a schema
 */
export function validateBody<T extends z.ZodType>(schema: T) {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      const body = await c.req.json();
      const result = schema.safeParse(body);
      
      if (!result.success) {
        return c.json({ 
          error: 'Validation error', 
          details: result.error.errors 
        }, 400);
      }
      
      // Add validated data to the context
      c.set('validatedBody', result.data);
      
      await next();
    } catch (error) {
      return c.json({ 
        error: 'Invalid JSON body',
        details: (error as Error).message
      }, 400);
    }
  };
}

/**
 * Validation middleware for query parameters
 */
export function validateQuery<T extends z.ZodType>(schema: T) {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      const query = c.req.query();
      const result = schema.safeParse(query);
      
      if (!result.success) {
        return c.json({ 
          error: 'Validation error', 
          details: result.error.errors 
        }, 400);
      }
      
      // Add validated data to the context
      c.set('validatedQuery', result.data);
      
      await next();
    } catch (error) {
      return c.json({ 
        error: 'Invalid query parameters',
        details: (error as Error).message
      }, 400);
    }
  };
}
