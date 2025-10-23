import { IsOptional, IsString, IsEnum, IsObject, IsNumber } from 'class-validator';
import { BlockData } from '../../../entities/portfolio.entity';

export class UpdateBlockDto {
  @IsOptional()
  @IsEnum(['title', 'richtext', 'list', 'images', 'resume', 'carousel', 'divider', 'link'])
  type?: 'title' | 'richtext' | 'list' | 'images' | 'resume' | 'carousel' | 'divider' | 'link';

  @IsOptional()
  @IsObject()
  data?: BlockData;

  @IsOptional()
  @IsNumber()
  position?: number;
}