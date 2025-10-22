import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProfileService, OptimizedAvatar } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../../entities/user.entity';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * Get current user profile
   */
  @Get()
  async getProfile(
    @CurrentUser() user: User,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.profileService.getProfile(user.id);
  }

  /**
   * Update user profile information
   */
  @Put()
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<Omit<User, 'passwordHash'>> {
    return this.profileService.updateProfile(user.id, updateProfileDto);
  }

  /**
   * Upload user avatar
   */
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<OptimizedAvatar> {
    return this.profileService.uploadAvatar(user.id, file);
  }

  /**
   * Delete user avatar
   */
  @Delete('avatar')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvatar(@CurrentUser() user: User): Promise<void> {
    return this.profileService.deleteAvatar(user.id);
  }
}