import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { CustomLoggerService } from '../services/logger.service';

@Injectable()
export class SecurityGuard implements CanActivate {
  private readonly suspiciousPatterns: RegExp[];
  private readonly blockedUserAgents: RegExp[];

  constructor(
    private configService: ConfigService,
    private logger: CustomLoggerService,
  ) {
    // Patterns that might indicate malicious activity
    this.suspiciousPatterns = [
      /\.\./g, // Path traversal
      /\/etc\/passwd/gi,
      /\/proc\//gi,
      /<script/gi,
      /javascript:/gi,
      /vbscript:/gi,
      /onload=/gi,
      /onerror=/gi,
      /eval\(/gi,
      /union.*select/gi, // SQL injection
      /drop.*table/gi,
      /insert.*into/gi,
      /delete.*from/gi,
    ];

    // Known malicious user agents or bots
    this.blockedUserAgents = [
      /sqlmap/gi,
      /nikto/gi,
      /nessus/gi,
      /masscan/gi,
      /nmap/gi,
      /burpsuite/gi,
      /havij/gi,
      /acunetix/gi,
    ];
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Check for suspicious patterns in URL, headers, and body
    if (this.containsSuspiciousContent(request)) {
      this.logSecurityViolation(request, 'Suspicious content detected');
      throw new ForbiddenException('Request blocked for security reasons');
    }

    // Check for blocked user agents
    if (this.isBlockedUserAgent(request)) {
      this.logSecurityViolation(request, 'Blocked user agent detected');
      throw new ForbiddenException('Access denied');
    }

    // Check for excessive header size (potential DoS)
    if (this.hasExcessiveHeaders(request)) {
      this.logSecurityViolation(request, 'Excessive header size detected');
      throw new ForbiddenException('Request headers too large');
    }

    return true;
  }

  private containsSuspiciousContent(request: Request): boolean {
    const checkString = (str: string): boolean => {
      return this.suspiciousPatterns.some(pattern => pattern.test(str));
    };

    // Check URL and query parameters
    if (checkString(request.url)) {
      return true;
    }

    // Check headers
    for (const [key, value] of Object.entries(request.headers)) {
      if (typeof value === 'string' && checkString(value)) {
        return true;
      }
      if (Array.isArray(value) && value.some(v => checkString(v))) {
        return true;
      }
    }

    // Check body (if it's a string or can be stringified)
    if (request.body) {
      try {
        const bodyStr = typeof request.body === 'string' 
          ? request.body 
          : JSON.stringify(request.body);
        if (checkString(bodyStr)) {
          return true;
        }
      } catch {
        // Ignore JSON stringify errors
      }
    }

    return false;
  }

  private isBlockedUserAgent(request: Request): boolean {
    const userAgent = request.get('User-Agent') || '';
    return this.blockedUserAgents.some(pattern => pattern.test(userAgent));
  }

  private hasExcessiveHeaders(request: Request): boolean {
    const maxHeaderSize = 8192; // 8KB
    const headersSize = JSON.stringify(request.headers).length;
    return headersSize > maxHeaderSize;
  }

  private logSecurityViolation(request: Request, reason: string): void {
    this.logger.security(`Security violation: ${reason}`, undefined, request.ip, {
      userAgent: request.get('User-Agent'),
      path: request.path,
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
  }
}