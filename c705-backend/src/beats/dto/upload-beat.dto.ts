import { IsString, IsInt, IsOptional, Min, Max } from 'class-validator';

export class UploadBeatDto {
  @IsString()
  title: string;

  @IsString()
  genre: string;

  @IsInt()
  @Min(60)
  @Max(200)
  bpm: number;

  @IsString()
  @IsOptional()
  mood?: string;

  @IsInt()
  @Min(0)
  price: number; // Price in cents
}

