import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio, PortfolioTemplate, Block } from '../../entities/portfolio.entity';
import { v4 as uuidv4 } from 'uuid';

export interface CreatePortfolioDto {
  title: string;
  template?: PortfolioTemplate;
  theme?: string;
}

export interface UpdatePortfolioDto {
  title?: string;
  template?: PortfolioTemplate;
  blocks?: Block[];
  theme?: string;
}

export interface PublishPortfolioDto {
  isPublished: boolean;
}

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Portfolio)
    private portfolioRepository: Repository<Portfolio>,
  ) {}

  async create(userId: string, createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const portfolio = this.portfolioRepository.create({
      userId,
      title: createPortfolioDto.title,
      template: createPortfolioDto.template || PortfolioTemplate.GALLERY,
      theme: createPortfolioDto.theme || 'default',
      blocks: [],
      isPublished: false,
    });

    return await this.portfolioRepository.save(portfolio);
  }

  async findByUserId(userId: string): Promise<Portfolio[]> {
    return await this.portfolioRepository.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id },
      relations: ['user', 'mediaFiles'],
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return portfolio;
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, userId },
      relations: ['mediaFiles'],
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found');
    }

    return portfolio;
  }

  async update(
    id: string,
    userId: string,
    updatePortfolioDto: UpdatePortfolioDto,
  ): Promise<Portfolio> {
    const portfolio = await this.findByIdAndUserId(id, userId);

    // Update only provided fields
    if (updatePortfolioDto.title !== undefined) {
      portfolio.title = updatePortfolioDto.title;
    }
    if (updatePortfolioDto.template !== undefined) {
      portfolio.template = updatePortfolioDto.template;
    }
    if (updatePortfolioDto.blocks !== undefined) {
      portfolio.blocks = updatePortfolioDto.blocks;
    }
    if (updatePortfolioDto.theme !== undefined) {
      portfolio.theme = updatePortfolioDto.theme;
    }

    return await this.portfolioRepository.save(portfolio);
  }

  async publish(
    id: string,
    userId: string,
    publishDto: PublishPortfolioDto,
  ): Promise<Portfolio> {
    const portfolio = await this.findByIdAndUserId(id, userId);

    portfolio.isPublished = publishDto.isPublished;
    
    // Generate public URL when publishing
    if (publishDto.isPublished && !portfolio.publicUrl) {
      portfolio.publicUrl = this.generatePublicUrl(id);
    }
    
    // Remove public URL when unpublishing
    if (!publishDto.isPublished) {
      portfolio.publicUrl = null;
    }

    return await this.portfolioRepository.save(portfolio);
  }

  async findPublicPortfolio(publicUrl: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { publicUrl, isPublished: true },
      relations: ['user', 'mediaFiles'],
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found or not published');
    }

    return portfolio;
  }

  async findPublicPortfolioById(id: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findOne({
      where: { id, isPublished: true },
      relations: ['user', 'mediaFiles'],
    });

    if (!portfolio) {
      throw new NotFoundException('Portfolio not found or not published');
    }

    return portfolio;
  }

  async delete(id: string, userId: string): Promise<void> {
    const portfolio = await this.findByIdAndUserId(id, userId);
    await this.portfolioRepository.remove(portfolio);
  }

  async duplicate(id: string, userId: string): Promise<Portfolio> {
    const originalPortfolio = await this.findByIdAndUserId(id, userId);

    const duplicatedPortfolio = this.portfolioRepository.create({
      userId,
      title: `${originalPortfolio.title} (Copy)`,
      template: originalPortfolio.template,
      blocks: JSON.parse(JSON.stringify(originalPortfolio.blocks)), // Deep copy
      theme: originalPortfolio.theme,
      isPublished: false, // Duplicated portfolios start as unpublished
      publicUrl: null,
    });

    return await this.portfolioRepository.save(duplicatedPortfolio);
  }

  private generatePublicUrl(portfolioId: string): string {
    // Generate a unique public URL slug
    const shortId = portfolioId.substring(0, 8);
    return `p-${shortId}`;
  }

  async addBlock(
    portfolioId: string,
    userId: string,
    block: Omit<Block, 'id' | 'position'>,
  ): Promise<Portfolio> {
    const portfolio = await this.findByIdAndUserId(portfolioId, userId);

    const newBlock: Block = {
      id: uuidv4(),
      position: portfolio.blocks.length,
      ...block,
    };

    portfolio.blocks.push(newBlock);

    return await this.portfolioRepository.save(portfolio);
  }

  async updateBlock(
    portfolioId: string,
    userId: string,
    blockId: string,
    blockData: Partial<Block>,
  ): Promise<Portfolio> {
    const portfolio = await this.findByIdAndUserId(portfolioId, userId);

    const blockIndex = portfolio.blocks.findIndex(block => block.id === blockId);
    if (blockIndex === -1) {
      throw new NotFoundException('Block not found');
    }

    portfolio.blocks[blockIndex] = {
      ...portfolio.blocks[blockIndex],
      ...blockData,
    };

    return await this.portfolioRepository.save(portfolio);
  }

  async removeBlock(
    portfolioId: string,
    userId: string,
    blockId: string,
  ): Promise<Portfolio> {
    const portfolio = await this.findByIdAndUserId(portfolioId, userId);

    portfolio.blocks = portfolio.blocks.filter(block => block.id !== blockId);

    // Reorder positions
    portfolio.blocks.forEach((block, index) => {
      block.position = index;
    });

    return await this.portfolioRepository.save(portfolio);
  }

  async reorderBlocks(
    portfolioId: string,
    userId: string,
    blockIds: string[],
  ): Promise<Portfolio> {
    const portfolio = await this.findByIdAndUserId(portfolioId, userId);

    // Create a map of existing blocks
    const blockMap = new Map(portfolio.blocks.map(block => [block.id, block]));

    // Reorder blocks based on provided order
    portfolio.blocks = blockIds
      .map(id => blockMap.get(id))
      .filter(Boolean) // Remove any undefined blocks
      .map((block, index) => ({
        ...block,
        position: index,
      }));

    return await this.portfolioRepository.save(portfolio);
  }
}