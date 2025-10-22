import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MediaService } from './media.service';
import { UploadMediaDto } from './dto/upload-media.dto';
import { UpdateProjectDetailsDto } from './dto/update-project-details.dto';
import { MediaQueryDto } from './dto/media-query.dto';

@Controller('media')
@UseGuards(JwtAuthGuard)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadMediaDto,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const projectDetails = uploadDto.title ? {
      title: uploadDto.title,
      description: uploadDto.description,
      tags: uploadDto.tags,
      year: uploadDto.year,
    } : undefined;

    const mediaFile = await this.mediaService.uploadImage(
      file,
      req.user.id,
      projectDetails,
    );

    return {
      success: true,
      data: mediaFile,
    };
  }

  @Get()
  async getMediaFiles(
    @Query() query: MediaQueryDto,
    @Request() req: any,
  ) {
    const { page = 1, limit = 20, portfolioId, search } = query;
    
    let mediaFiles;
    
    if (portfolioId) {
      mediaFiles = await this.mediaService.findByPortfolioId(portfolioId);
    } else {
      mediaFiles = await this.mediaService.findByUserId(req.user.id);
    }

    // Apply search filter if provided
    if (search) {
      const searchLower = search.toLowerCase();
      mediaFiles = mediaFiles.filter(file => 
        file.originalName.toLowerCase().includes(searchLower) ||
        file.projectDetails?.title?.toLowerCase().includes(searchLower) ||
        file.projectDetails?.description?.toLowerCase().includes(searchLower) ||
        file.projectDetails?.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply pagination
    const total = mediaFiles.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedFiles = mediaFiles.slice(startIndex, endIndex);

    return {
      success: true,
      data: {
        files: paginatedFiles,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: endIndex < total,
          hasPrev: page > 1,
        },
      },
    };
  }

  @Get(':id')
  async getMediaFile(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const mediaFile = await this.mediaService.findByIdAndUserId(id, req.user.id);
    
    return {
      success: true,
      data: mediaFile,
    };
  }

  @Put(':id/project-details')
  async updateProjectDetails(
    @Param('id') id: string,
    @Body() updateDto: UpdateProjectDetailsDto,
    @Request() req: any,
  ) {
    const mediaFile = await this.mediaService.updateProjectDetails(
      id,
      req.user.id,
      updateDto,
    );

    return {
      success: true,
      data: mediaFile,
    };
  }

  @Put(':id/assign-portfolio/:portfolioId')
  async assignToPortfolio(
    @Param('id') id: string,
    @Param('portfolioId') portfolioId: string,
    @Request() req: any,
  ) {
    const mediaFile = await this.mediaService.assignToPortfolio(
      id,
      req.user.id,
      portfolioId,
    );

    return {
      success: true,
      data: mediaFile,
    };
  }

  @Put(':id/remove-from-portfolio')
  async removeFromPortfolio(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const mediaFile = await this.mediaService.removeFromPortfolio(
      id,
      req.user.id,
    );

    return {
      success: true,
      data: mediaFile,
    };
  }

  @Delete(':id')
  async deleteMediaFile(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    await this.mediaService.deleteMediaFile(id, req.user.id);

    return {
      success: true,
      message: 'Media file deleted successfully',
    };
  }
}