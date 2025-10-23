import { IsString, IsOptional, IsEnum } from 'class-validator';
import { PortfolioTemplate } from '../../../entities/portfolio.entity';

export class CreatePortfolioDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsEnum(PortfolioTemplate)
  template?: PortfolioTemplate;

  @IsOptional()
  @IsString()
  theme?: string;
}