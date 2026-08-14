import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  title?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  content?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  city?: string;
}

