import { Module, Global } from '@nestjs/common';
import { CustomLoggerService } from './services/logger.service';
import { SecurityGuard } from './guards/security.guard';
import { RateLimitMiddleware } from './middleware/rate-limit.middleware';
import { SecurityHeadersMiddleware } from './middleware/security-headers.middleware';
import { SanitizationMiddleware } from './middleware/sanitization.middleware';
import { SecurityConfigService } from '../config/security.config';

@Global()
@Module({
  providers: [
    CustomLoggerService,
    SecurityGuard,
    RateLimitMiddleware,
    SecurityHeadersMiddleware,
    SanitizationMiddleware,
    SecurityConfigService,
  ],
  exports: [
    CustomLoggerService,
    SecurityGuard,
    RateLimitMiddleware,
    SecurityHeadersMiddleware,
    SanitizationMiddleware,
    SecurityConfigService,
  ],
})
export class CommonModule {}