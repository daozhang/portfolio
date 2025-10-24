import { IsOptional, IsString, MaxLength } from 'class-validator';
import { IsSafeHtml } from '../../../common/decorators/validation.decorators';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @IsSafeHtml()
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  @IsSafeHtml()
  bio?: string;
}