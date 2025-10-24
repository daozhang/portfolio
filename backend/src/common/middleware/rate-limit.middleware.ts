import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from '../services/logger.service';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService,
  ) {
    this.windowMs = this.configService.get('RATE_LIMIT_TTL') || 900000; // 15 minutes
    this.maxRequests = this.configService.get('RATE_LIMIT_LIMIT') || 100;
  }

  use(req: Request, res: Response, next: NextFunction) {
    const key = this.getKey(req);
    const now = Date.now();
    
    // Clean up expired entries
    this.cleanup(now);
    
    // Get or create entry for this key
    if (!this.store[key]) {
      this.store[key] = {
        count: 0,
        resetTime: now + this.windowMs,
      };
    }
    
    const entry = this.store[key];
    
    // Reset if window has expired
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + this.windowMs;
    }
    
    // Increment counter
    entry.count++;
    
    // Set rate limit headers
    res.set({
      'X-RateLimit-Limit': this.maxRequests.toString(),
      'X-RateLimit-Remaining': Math.max(0, this.maxRequests - entry.count).toString(),
      'X-RateLimit-Reset': new Date(entry.resetTime).toISOString(),
    });
    
    // Check if limit exceeded
    if (entry.count > this.maxRequests) {
      this.logger.security('Rate limit exceeded', undefined, req.ip, {
        userAgent: req.get('User-Agent'),
        path: req.path,
        method: req.method,
        count: entry.count,
      });
      
      res.status(429).json({
        statusCode: 429,
        message: 'Too many requests',
        error: 'Rate Limit Exceeded',
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      });
      return;
    }
    
    next();
  }
  
  private getKey(req: Request): string {
    // Use IP address as the key, but could be enhanced with user ID for authenticated requests
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
  
  private cleanup(now: number) {
    // Remove expired entries to prevent memory leaks
    Object.keys(this.store).forEach(key => {
      if (now > this.store[key].resetTime + this.windowMs) {
        delete this.store[key];
      }
    });
  }
}