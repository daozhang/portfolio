import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface SecurityConfig {
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  bcrypt: {
    rounds: number;
  };
  jwt: {
    expiresIn: string;
  };
  upload: {
    maxFileSize: number;
    allowedMimeTypes: string[];
    allowedExtensions: string[];
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
}

@Injectable()
export class SecurityConfigService {
  constructor(private configService: ConfigService) {}

  getSecurityConfig(): SecurityConfig {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    
    return {
      rateLimit: {
        windowMs: this.configService.get('RATE_LIMIT_TTL') || 900000, // 15 minutes
        maxRequests: this.configService.get('RATE_LIMIT_LIMIT') || (isProduction ? 100 : 1000),
      },
      bcrypt: {
        rounds: this.configService.get('BCRYPT_ROUNDS') || (isProduction ? 12 : 10),
      },
      jwt: {
        expiresIn: this.configService.get('JWT_EXPIRES_IN') || '24h',
      },
      upload: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
        ],
        allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      },
      cors: {
        origin: this.getCorsOrigin(),
        credentials: true,
      },
    };
  }

  private getCorsOrigin(): string | string[] {
    const corsOrigin = this.configService.get('CORS_ORIGIN');
    
    if (!corsOrigin) {
      return 'http://localhost:3000';
    }
    
    // Support multiple origins separated by comma
    if (corsOrigin.includes(',')) {
      return corsOrigin.split(',').map(origin => origin.trim());
    }
    
    return corsOrigin;
  }

  // Security validation helpers
  isValidImageMimeType(mimeType: string): boolean {
    return this.getSecurityConfig().upload.allowedMimeTypes.includes(mimeType);
  }

  isValidImageExtension(filename: string): boolean {
    const extension = filename.toLowerCase().split('.').pop();
    return extension ? this.getSecurityConfig().upload.allowedExtensions.includes(extension) : false;
  }

  isFileSizeValid(size: number): boolean {
    return size <= this.getSecurityConfig().upload.maxFileSize;
  }
}