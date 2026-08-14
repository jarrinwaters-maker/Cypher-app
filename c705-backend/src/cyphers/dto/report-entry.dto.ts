import { IsString } from 'class-validator';

export class ReportEntryDto {
  @IsString()
  reason: string;
}

