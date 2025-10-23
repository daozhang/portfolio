import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
import { PublishPortfolioDto } from './dto/publish-portfolio.dto';
import { AddBlockDto } from './dto/add-block.dto';
import { UpdateBlockDto } from './dto/update-block.dto';
import { ReorderBlocksDto } from './dto/reorder-blocks.dto';

@Controller('portfolios')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  // Protected routes (require authentication)
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPortfolio(
    @Body() createPortfolioDto: CreatePortfolioDto,
    @Request() req: any,
  ) {
    const portfolio = await this.portfolioService.create(
      req.user.id,
      createPortfolioDto,
    );

    return {
      success: true,
      data: portfolio,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserPortfolios(@Request() req: any) {
    const portfolios = await this.portfolioService.findByUserId(req.user.id);

    return {
      success: true,
      data: portfolios,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getPortfolio(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const portfolio = await this.portfolioService.findByIdAndUserId(
      id,
      req.user.id,
    );

    return {
      success: true,
      data: portfolio,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updatePortfolio(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto,
    @Request() req: any,
  ) {
    const portfolio = await this.portfolioService.update(
      id,
      req.user.id,
      updatePortfolioDto,
    );

    return {
      success: true,
      data: portfolio,
    };
  }

  @Put(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publishPortfolio(
    @Param('id') id: string,
    @Body() publishDto: PublishPortfolioDto,
    @Request() req: any,
  ) {
    const portfolio = await this.portfolioService.publish(
      id,
      req.user.id,
      publishDto,
    );

    return {
      success: true,
      data: portfolio,
    };
  }

  @Post(':id/duplicate')
  @UseGuards(JwtAuthGuard)
  async duplicatePortfolio(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    const portfolio = await this.portfolioService.duplicate(id, req.user.id);

    return {
      success: true,
      data: portfolio,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deletePortfolio(
    @Param('id') id: string,
    @Request() req: any,
  ) {
    await this.portfolioService.delete(id, req.user.id);

    return {
      success: true,
      message: 'Portfolio deleted successfully',
    };
  }

  // Block management endpoints
  @Post(':id/blocks')
  @UseGuards(JwtAuthGuard)
  async addBlock(
    @Param('id') portfolioId: string,
    @Body() addBlockDto: AddBlockDto,
    @Request() req: any,
  ) {
    const portfolio = await this.portfolioService.addBlock(
      portfolioId,
      req.user.id,
      addBlockDto,
    );

    return {
      success: true,
      data: portfolio,
    };
  }

  @Put(':id/blocks/:blockId')
  @UseGuards(JwtAuthGuard)
  async updateBlock(
    @Param('id') portfolioId: string,
    @Param('blockId') blockId: string,
    @Body() updateBlockDto: UpdateBlockDto,
    @Request() req: any,
  ) {
    const portfolio = await this.portfolioService.updateBlock(
      portfolioId,
      req.user.id,
      blockId,
      updateBlockDto,
    );

    return {
      success: true,
      data: portfolio,
    };
  }

  @Delete(':id/blocks/:blockId')
  @UseGuards(JwtAuthGuard)
  async removeBlock(
    @Param('id') portfolioId: string,
    @Param('blockId') blockId: string,
    @Request() req: any,
  ) {
    const portfolio = await this.portfolioService.removeBlock(
      portfolioId,
      req.user.id,
      blockId,
    );

    return {
      success: true,
      data: portfolio,
    };
  }

  @Put(':id/blocks/reorder')
  @UseGuards(JwtAuthGuard)
  async reorderBlocks(
    @Param('id') portfolioId: string,
    @Body() reorderDto: ReorderBlocksDto,
    @Request() req: any,
  ) {
    const portfolio = await this.portfolioService.reorderBlocks(
      portfolioId,
      req.user.id,
      reorderDto.blockIds,
    );

    return {
      success: true,
      data: portfolio,
    };
  }

  // Public routes (no authentication required)
  @Get('public/url/:publicUrl')
  async getPublicPortfolioByUrl(@Param('publicUrl') publicUrl: string) {
    const portfolio = await this.portfolioService.findPublicPortfolio(publicUrl);

    return {
      success: true,
      data: portfolio,
    };
  }

  @Get('public/id/:id')
  async getPublicPortfolioById(@Param('id') id: string) {
    const portfolio = await this.portfolioService.findPublicPortfolioById(id);

    return {
      success: true,
      data: portfolio,
    };
  }
}