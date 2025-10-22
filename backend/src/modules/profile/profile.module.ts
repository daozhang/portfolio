import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { User } from '../../entities/user.entity';
import { FirebaseConfig } from '../../config/firebase.config';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [ProfileController],
  providers: [ProfileService, FirebaseConfig],
  exports: [ProfileService],
})
export class ProfileModule {}