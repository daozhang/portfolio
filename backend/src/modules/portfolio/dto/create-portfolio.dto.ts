import { IsString, IsOptional, IsEnum, MaxLength, MinLength } from 'class-validator';
import { PortfolioTemplate } from '../../../entities/portfolio.entity';
import { IsSafeHtml } from '../../../common/decorators/validation.decorators';

export class CreatePortfolioDto {
  @IsString()
  @MinLength(1, { message: 'Title cannot be empty' })
  @MaxLength(100, { message: 'Title must not exceed 100 characters' })
  @IsSafeHtml()
  title: string;

  @IsOptional()
  @IsEnum(PortfolioTemplate)
  template?: PortfolioTemplate;

  @IsOptional()
  @IsString()
  theme?: string;
}