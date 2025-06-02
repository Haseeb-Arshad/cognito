import { Context as HonoContext } from 'hono';

/**
 * Extended Hono Context type with our JWT payload
 */
export type Context = HonoContext & {
  // JWT payload properties
  get(key: 'jwtPayload'): {
    sub: string;       // user ID
    email?: string;    // user email
    role?: string;     // user role
    exp: number;       // expiration time
    iat: number;       // issued at time
  };
}
