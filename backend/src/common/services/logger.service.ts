import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface LogContext {
  userId?: string;
  requestId?: string;
  action?: string;
  resource?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class CustomLoggerService implements LoggerService {
  private readonly logLevel: LogLevel[];
  private readonly isProduction: boolean;

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
    this.logLevel = this.getLogLevels();
  }

  private getLogLevels(): LogLevel[] {
    const level = this.configService.get('LOG_LEVEL') || 'info';
    
    switch (level) {
      case 'error':
        return ['error'];
      case 'warn':
        return ['error', 'warn'];
      case 'info':
        return ['error', 'warn', 'log'];
      case 'debug':
        return ['error', 'warn', 'log', 'debug'];
      case 'verbose':
        return ['error', 'warn', 'log', 'debug', 'verbose'];
      default:
        return ['error', 'warn', 'log'];
    }
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      environment: this.configService.get('NODE_ENV'),
      ...context,
    };

    return this.isProduction ? JSON.stringify(logEntry) : this.formatForDevelopment(logEntry);
  }

  private formatForDevelopment(logEntry: any): string {
    const { timestamp, level, message, ...context } = logEntry;
    let formatted = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (Object.keys(context).length > 0) {
      formatted += ` - Context: ${JSON.stringify(context, null, 2)}`;
    }
    
    return formatted;
  }

  log(message: string, context?: LogContext) {
    if (this.logLevel.includes('log')) {
      console.log(this.formatMessage('log', message, context));
    }
  }

  error(message: string, trace?: string, context?: LogContext) {
    if (this.logLevel.includes('error')) {
      const errorContext = { ...context, trace };
      console.error(this.formatMessage('error', message, errorContext));
    }
  }

  warn(message: string, context?: LogContext) {
    if (this.logLevel.includes('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  debug(message: string, context?: LogContext) {
    if (this.logLevel.includes('debug')) {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  verbose(message: string, context?: LogContext) {
    if (this.logLevel.includes('verbose')) {
      console.log(this.formatMessage('verbose', message, context));
    }
  }

  // Audit logging for security-sensitive operations
  audit(action: string, userId: string, resource?: string, metadata?: Record<string, any>) {
    const auditContext: LogContext = {
      userId,
      action,
      resource,
      metadata,
    };
    
    this.log(`AUDIT: ${action}`, auditContext);
  }

  // Performance logging
  performance(operation: string, duration: number, context?: LogContext) {
    const perfContext: LogContext = {
      ...context,
      metadata: { ...context?.metadata, operation, duration },
    };
    
    this.log(`PERFORMANCE: ${operation} completed in ${duration}ms`, perfContext);
  }

  // Security logging
  security(event: string, userId?: string, ip?: string, metadata?: Record<string, any>) {
    const securityContext: LogContext = {
      userId,
      metadata: { ...metadata, ip },
    };
    
    this.warn(`SECURITY: ${event}`, securityContext);
  }
}