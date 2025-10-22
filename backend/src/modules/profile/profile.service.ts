import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as sharp from 'sharp';
import { User } from '../../entities/user.entity';
import { FirebaseConfig } from '../../config/firebase.config';
import { UpdateProfileDto } from './dto/update-profile.dto';

export interface OptimizedAvatar {
  original: string;
  thumbnail: string;
}

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private firebaseConfig: FirebaseConfig,
  ) {}

  /**
   * Get user profile by ID
   */
  async getProfile(userId: string): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { passwordHash, ...userProfile } = user;
    return userProfile;
  }

  /**
   * Update user profile information
   */
  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update user fields
    Object.assign(user, updateProfileDto);

    const updatedUser = await this.userRepository.save(user);
    const { passwordHash, ...userProfile } = updatedUser;
    return userProfile;
  }

  /**
   * Upload and optimize avatar image
   */
  async uploadAvatar(
    userId: string,
    file: Express.Multer.File,
  ): Promise<OptimizedAvatar> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, and WebP are allowed.',
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum 5MB allowed.');
    }

    try {
      // Optimize images
      const optimizedImages = await this.optimizeAvatar(file.buffer);

      // Upload to Firebase Storage
      const urls = await this.uploadToFirebase(userId, optimizedImages);

      // Update user avatar URL
      await this.updateUserAvatar(userId, urls.original);

      return urls;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw new InternalServerErrorException('Failed to upload avatar');
    }
  }

  /**
   * Delete user avatar
   */
  async deleteAvatar(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.avatar) {
      try {
        // Delete from Firebase Storage
        await this.deleteFromFirebase(user.avatar);

        // Update user record
        user.avatar = null;
        await this.userRepository.save(user);
      } catch (error) {
        console.error('Avatar deletion error:', error);
        throw new InternalServerErrorException('Failed to delete avatar');
      }
    }
  }

  /**
   * Optimize avatar image using Sharp
   */
  private async optimizeAvatar(
    buffer: Buffer,
  ): Promise<{ original: Buffer; thumbnail: Buffer }> {
    try {
      // Original optimized version (max 800x800)
      const original = await sharp(buffer)
        .resize(800, 800, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85, progressive: true })
        .toBuffer();

      // Thumbnail version (150x150)
      const thumbnail = await sharp(buffer)
        .resize(150, 150, {
          fit: 'cover',
        })
        .jpeg({ quality: 80, progressive: true })
        .toBuffer();

      return { original, thumbnail };
    } catch (error) {
      console.error('Image optimization error:', error);
      throw new BadRequestException('Failed to process image');
    }
  }

  /**
   * Upload optimized images to Firebase Storage
   */
  private async uploadToFirebase(
    userId: string,
    images: { original: Buffer; thumbnail: Buffer },
  ): Promise<OptimizedAvatar> {
    const storage = this.firebaseConfig.getStorage();
    const bucket = storage.bucket();

    const timestamp = Date.now();
    const originalFileName = `avatars/${userId}/original_${timestamp}.jpg`;
    const thumbnailFileName = `avatars/${userId}/thumbnail_${timestamp}.jpg`;

    try {
      // Upload original
      const originalFile = bucket.file(originalFileName);
      await originalFile.save(images.original, {
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000', // 1 year
        },
      });

      // Upload thumbnail
      const thumbnailFile = bucket.file(thumbnailFileName);
      await thumbnailFile.save(images.thumbnail, {
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000', // 1 year
        },
      });

      // Make files publicly accessible
      await originalFile.makePublic();
      await thumbnailFile.makePublic();

      // Generate public URLs
      const originalUrl = `https://storage.googleapis.com/${bucket.name}/${originalFileName}`;
      const thumbnailUrl = `https://storage.googleapis.com/${bucket.name}/${thumbnailFileName}`;

      return {
        original: originalUrl,
        thumbnail: thumbnailUrl,
      };
    } catch (error) {
      console.error('Firebase upload error:', error);
      throw new InternalServerErrorException('Failed to upload to storage');
    }
  }

  /**
   * Delete avatar from Firebase Storage
   */
  private async deleteFromFirebase(avatarUrl: string): Promise<void> {
    try {
      const storage = this.firebaseConfig.getStorage();
      const bucket = storage.bucket();

      // Extract file path from URL
      const urlParts = avatarUrl.split('/');
      const fileName = urlParts.slice(-2).join('/'); // Get "avatars/userId/filename"

      // Delete original file
      const file = bucket.file(fileName);
      await file.delete();

      // Also try to delete thumbnail (replace "original_" with "thumbnail_")
      const thumbnailFileName = fileName.replace('original_', 'thumbnail_');
      const thumbnailFile = bucket.file(thumbnailFileName);
      try {
        await thumbnailFile.delete();
      } catch (error) {
        // Thumbnail might not exist, ignore error
        console.warn('Thumbnail deletion failed:', error.message);
      }
    } catch (error) {
      console.error('Firebase deletion error:', error);
      // Don't throw error here to avoid blocking user operations
    }
  }

  /**
   * Update user avatar URL in database
   */
  private async updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
    await this.userRepository.update(userId, { avatar: avatarUrl });
  }
}