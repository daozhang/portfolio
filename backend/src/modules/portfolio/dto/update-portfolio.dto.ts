import { IsString, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PortfolioTemplate, Block } from '../../../entities/portfolio.entity';

export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEnum(PortfolioTemplate)
  template?: PortfolioTemplate;

  @IsOptional()
  @IsArray()
  blocks?: Block[];

  @IsOptional()
  @IsString()
  theme?: string;
}