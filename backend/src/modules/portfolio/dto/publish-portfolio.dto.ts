import { IsBoolean } from 'class-validator';

export class PublishPortfolioDto {
  @IsBoolean()
  isPublished: boolean;
}