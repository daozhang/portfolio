import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaFile, MediaFileUrls, MediaFileMetadata, ProjectDetails } from '../../entities/media-file.entity';
import { FirebaseStorageService } from './firebase-storage.service';

export interface CreateMediaFileDto {
  originalName: string;
  urls: MediaFileUrls;
  metadata: MediaFileMetadata;
  projectDetails?: ProjectDetails;
}

export interface UpdateProjectDetailsDto {
  title: string;
  description?: string;
  tags?: string[];
  year?: number;
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(MediaFile)
    private mediaFileRepository: Repository<MediaFile>,
    private firebaseStorageService: FirebaseStorageService,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
    projectDetails?: ProjectDetails,
  ): Promise<MediaFile> {
    // Upload to Firebase Storage and get optimized versions
    const { urls, metadata } = await this.firebaseStorageService.uploadImage(file, userId);

    // Create media file record in database
    const mediaFile = this.mediaFileRepository.create({
      userId,
      originalName: file.originalname,
      urls,
      metadata,
      projectDetails,
    });

    return await this.mediaFileRepository.save(mediaFile);
  }

  async createMediaFile(
    userId: string,
    createMediaFileDto: CreateMediaFileDto,
  ): Promise<MediaFile> {
    const mediaFile = this.mediaFileRepository.create({
      userId,
      ...createMediaFileDto,
    });

    return await this.mediaFileRepository.save(mediaFile);
  }

  async findByUserId(userId: string): Promise<MediaFile[]> {
    return await this.mediaFileRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<MediaFile> {
    const mediaFile = await this.mediaFileRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!mediaFile) {
      throw new NotFoundException('Media file not found');
    }

    return mediaFile;
  }

  async findByIdAndUserId(id: string, userId: string): Promise<MediaFile> {
    const mediaFile = await this.mediaFileRepository.findOne({
      where: { id, userId },
    });

    if (!mediaFile) {
      throw new NotFoundException('Media file not found');
    }

    return mediaFile;
  }

  async updateProjectDetails(
    id: string,
    userId: string,
    updateDto: UpdateProjectDetailsDto,
  ): Promise<MediaFile> {
    const mediaFile = await this.findByIdAndUserId(id, userId);
    
    mediaFile.projectDetails = updateDto;
    
    return await this.mediaFileRepository.save(mediaFile);
  }

  async deleteMediaFile(id: string, userId: string): Promise<void> {
    const mediaFile = await this.findByIdAndUserId(id, userId);
    
    // Delete files from Firebase Storage
    await this.firebaseStorageService.deleteImage(mediaFile.urls);
    
    // Remove database record
    await this.mediaFileRepository.remove(mediaFile);
  }

  async findByPortfolioId(portfolioId: string): Promise<MediaFile[]> {
    return await this.mediaFileRepository.find({
      where: { portfolioId },
      order: { createdAt: 'DESC' },
    });
  }

  async assignToPortfolio(
    id: string,
    userId: string,
    portfolioId: string,
  ): Promise<MediaFile> {
    const mediaFile = await this.findByIdAndUserId(id, userId);
    
    mediaFile.portfolioId = portfolioId;
    
    return await this.mediaFileRepository.save(mediaFile);
  }

  async removeFromPortfolio(id: string, userId: string): Promise<MediaFile> {
    const mediaFile = await this.findByIdAndUserId(id, userId);
    
    mediaFile.portfolioId = null;
    
    return await this.mediaFileRepository.save(mediaFile);
  }
}