import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaFile } from '../../entities/media-file.entity';
import { MediaService } from './media.service';
import { FirebaseStorageService } from './firebase-storage.service';
import { MediaController } from './media.controller';
import { FirebaseConfig } from '../../config/firebase.config';

@Module({
  imports: [TypeOrmModule.forFeature([MediaFile])],
  controllers: [MediaController],
  providers: [MediaService, FirebaseStorageService, FirebaseConfig],
  exports: [MediaService, FirebaseStorageService],
})
export class MediaModule {}