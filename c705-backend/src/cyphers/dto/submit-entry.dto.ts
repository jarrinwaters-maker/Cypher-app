import { IsString, IsOptional } from 'class-validator';

export class SubmitEntryDto {
  @IsString()
  @IsOptional()
  title?: string;
}

