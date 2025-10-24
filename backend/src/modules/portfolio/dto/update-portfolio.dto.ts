import { IsString, IsOptional, IsEnum, IsArray, ValidateNested, MaxLength, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { PortfolioTemplate, Block } from '../../../entities/portfolio.entity';
import { IsSafeHtml } from '../../../common/decorators/validation.decorators';

export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  @IsSafeHtml()
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