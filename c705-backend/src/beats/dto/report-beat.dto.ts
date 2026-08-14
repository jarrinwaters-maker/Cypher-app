import { IsString, MinLength } from 'class-validator';

export class ReportBeatDto {
  @IsString()
  @MinLength(10)
  reason: string;
}

