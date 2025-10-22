import { Injectable, BadRequestException } from '@nestjs/common';
import { FirebaseConfig } from '../../config/firebase.config';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { MediaFileUrls, MediaFileMetadata } from '../../entities/media-file.entity';

export interface OptimizedImages {
  original: Buffer;
  thumbnail: Buffer;
  mobile: Buffer;
  desktop: Buffer;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

@Injectable()
export class FirebaseStorageService {
  private bucket: any;

  constructor(private firebaseConfig: FirebaseConfig) {
    this.bucket = this.firebaseConfig.getStorage().bucket();
  }

  async uploadImage(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ urls: MediaFileUrls; metadata: MediaFileMetadata }> {
    // Validate file type
    if (!this.isValidImageType(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP are supported.');
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      throw new BadRequestException('File size too large. Maximum size is 10MB.');
    }

    try {
      // Generate unique filename
      const fileId = uuidv4();
      const fileExtension = this.getFileExtension(file.originalname);
      
      // Optimize images
      const optimizedImages = await this.optimizeImage(file.buffer);
      
      // Get original image metadata
      const originalMetadata = await sharp(file.buffer).metadata();
      
      // Upload all versions to Firebase Storage
      const urls = await this.uploadAllVersions(
        optimizedImages,
        userId,
        fileId,
        fileExtension,
      );

      const metadata: MediaFileMetadata = {
        size: file.size,
        mimeType: file.mimetype,
        dimensions: {
          width: originalMetadata.width || 0,
          height: originalMetadata.height || 0,
        },
      };

      return { urls, metadata };
    } catch (error) {
      throw new BadRequestException(`Failed to upload image: ${error.message}`);
    }
  }

  private async optimizeImage(buffer: Buffer): Promise<OptimizedImages> {
    const sharpImage = sharp(buffer);
    
    // Original (compressed but full size)
    const original = await sharpImage
      .jpeg({ quality: 90, progressive: true })
      .toBuffer();

    // Thumbnail (150x150, cropped to square)
    const thumbnail = await sharpImage
      .resize(150, 150, { 
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Mobile (max width 768px, maintain aspect ratio)
    const mobile = await sharpImage
      .resize(768, null, { 
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 85 })
      .toBuffer();

    // Desktop (max width 1920px, maintain aspect ratio)
    const desktop = await sharpImage
      .resize(1920, null, { 
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 90 })
      .toBuffer();

    return { original, thumbnail, mobile, desktop };
  }

  private async uploadAllVersions(
    images: OptimizedImages,
    userId: string,
    fileId: string,
    extension: string,
  ): Promise<MediaFileUrls> {
    const basePath = `users/${userId}/media/${fileId}`;
    
    const [originalUrl, thumbnailUrl, mobileUrl, desktopUrl] = await Promise.all([
      this.uploadBuffer(images.original, `${basePath}/original.${extension}`),
      this.uploadBuffer(images.thumbnail, `${basePath}/thumbnail.jpg`),
      this.uploadBuffer(images.mobile, `${basePath}/mobile.jpg`),
      this.uploadBuffer(images.desktop, `${basePath}/desktop.jpg`),
    ]);

    return {
      original: originalUrl,
      thumbnail: thumbnailUrl,
      mobile: mobileUrl,
      desktop: desktopUrl,
    };
  }

  private async uploadBuffer(buffer: Buffer, path: string): Promise<string> {
    const file = this.bucket.file(path);
    
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public, max-age=31536000', // 1 year cache
      },
    });

    // Make file publicly readable
    await file.makePublic();

    return `https://storage.googleapis.com/${this.bucket.name}/${path}`;
  }

  async deleteImage(urls: MediaFileUrls): Promise<void> {
    try {
      const deletePromises = Object.values(urls).map(url => {
        const path = this.extractPathFromUrl(url);
        return this.bucket.file(path).delete();
      });

      await Promise.all(deletePromises);
    } catch (error) {
      // Log error but don't throw - file might already be deleted
      console.error('Error deleting files from Firebase Storage:', error);
    }
  }

  private extractPathFromUrl(url: string): string {
    // Extract path from Firebase Storage URL
    const match = url.match(/googleapis\.com\/[^\/]+\/(.+)$/);
    return match ? match[1] : '';
  }

  private isValidImageType(mimeType: string): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return validTypes.includes(mimeType);
  }

  private getFileExtension(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension === 'jpg' ? 'jpeg' : extension || 'jpeg';
  }

  async extractMetadata(buffer: Buffer): Promise<ImageDimensions> {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
      };
    } catch (error) {
      throw new BadRequestException('Failed to extract image metadata');
    }
  }
}