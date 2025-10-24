import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('health')
export class HealthController {
  constructor(private configService: ConfigService) {}

  @Get()
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get('NODE_ENV'),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  @Get('ready')
  getReadiness() {
    // Add database connectivity check here if needed
    return {
      status: 'ready',
      timestamp: new Date().toISOString(),
    };
  }
}