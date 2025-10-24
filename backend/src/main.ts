import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { CustomValidationPipe } from './common/pipes/validation.pipe';
import { CustomLoggerService } from './common/services/logger.service';
import { SecurityGuard } from './common/guards/security.guard';
import { RateLimitMiddleware } from './common/middleware/rate-limit.middleware';
import { SecurityHeadersMiddleware } from './common/middleware/security-headers.middleware';
import { SanitizationMiddleware } from './common/middleware/sanitization.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  
  const configService = app.get(ConfigService);
  const logger = app.get(CustomLoggerService);
  
  // Use custom logger
  app.useLogger(logger);

  // Security middleware (order matters)
  app.use(new SecurityHeadersMiddleware(configService).use.bind(new SecurityHeadersMiddleware(configService)));
  app.use(new SanitizationMiddleware().use.bind(new SanitizationMiddleware()));
  app.use(new RateLimitMiddleware(configService, logger).use.bind(new RateLimitMiddleware(configService, logger)));

  // Global security guard
  app.useGlobalGuards(new SecurityGuard(configService, logger));

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global logging interceptor
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Global validation pipe with custom error formatting
  app.useGlobalPipes(new CustomValidationPipe());

  // CORS configuration
  app.enableCors({
    origin: configService.get('CORS_ORIGIN') || 'http://localhost:3000',
    credentials: true,
  });

  // Global prefix for API routes
  app.setGlobalPrefix('api');

  const port = configService.get('PORT') || 3001;
  
  await app.listen(port);
  
  logger.log(`Application is running on: http://localhost:${port}`, {
    action: 'application_start',
    metadata: { port, environment: configService.get('NODE_ENV') },
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});