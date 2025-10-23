import { IsString, IsEnum, IsObject, IsNumber } from 'class-validator';
import { BlockData } from '../../../entities/portfolio.entity';

export class AddBlockDto {
  @IsEnum(['title', 'richtext', 'list', 'images', 'resume', 'carousel', 'divider', 'link'])
  type: 'title' | 'richtext' | 'list' | 'images' | 'resume' | 'carousel' | 'divider' | 'link';

  @IsObject()
  data: BlockData;
}