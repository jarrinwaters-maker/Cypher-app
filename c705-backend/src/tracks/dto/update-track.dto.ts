import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsOptional()
  @MinLength(1)
  title?: string;
}

