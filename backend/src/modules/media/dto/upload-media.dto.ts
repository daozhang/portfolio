import { IsOptional, IsString, IsArray, IsNumber, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class UploadMediaDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    return value;
  })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 10)
  @Transform(({ value }) => parseInt(value))
  year?: number;
}