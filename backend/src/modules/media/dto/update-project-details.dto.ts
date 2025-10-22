import { IsString, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';

export class UpdateProjectDetailsDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 10)
  year?: number;
}