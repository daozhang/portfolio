import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './config/database.config';
import { FirebaseConfig } from './config/firebase.config';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MediaModule } from './modules/media/media.module';
import { PortfolioModule } from './modules/portfolio/portfolio.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfig,
    }),
    AuthModule,
    ProfileModule,
    MediaModule,
    PortfolioModule,
    AdminModule,
  ],
  controllers: [],
  providers: [FirebaseConfig],
})
export class AppModule {}