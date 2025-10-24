import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityHeadersMiddleware implements NestMiddleware {
  constructor(private configService: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const corsOrigin = this.configService.get('CORS_ORIGIN') || 'http://localhost:3000';
    
    // Security headers
    res.set({
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // Enable XSS protection
      'X-XSS-Protection': '1; mode=block',
      
      // Referrer policy
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      
      // Content Security Policy
      'Content-Security-Policy': this.getCSP(corsOrigin, isProduction),
      
      // Strict Transport Security (HTTPS only in production)
      ...(isProduction && {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      }),
      
      // Permissions Policy (formerly Feature Policy)
      'Permissions-Policy': [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()',
      ].join(', '),
      
      // Remove server information
      'Server': '',
      'X-Powered-By': '',
    });
    
    // Remove Express headers
    res.removeHeader('X-Powered-By');
    
    next();
  }
  
  private getCSP(corsOrigin: string, isProduction: boolean): string {
    const baseCSP = [
      "default-src 'self'",
      `connect-src 'self' ${corsOrigin} https://firebasestorage.googleapis.com`,
      "img-src 'self' data: https: blob:",
      "media-src 'self' https: blob:",
      "font-src 'self' data:",
      "style-src 'self' 'unsafe-inline'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];
    
    if (isProduction) {
      baseCSP.push("upgrade-insecure-requests");
      baseCSP.push("script-src 'self'");
    } else {
      // Allow eval and inline scripts in development for hot reloading
      baseCSP.push("script-src 'self' 'unsafe-eval' 'unsafe-inline'");
    }
    
    return baseCSP.join('; ');
  }
}