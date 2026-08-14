import { IsString, IsOptional, IsEnum, IsDateString, IsUrl } from 'class-validator';

export enum CypherType {
  OPEN = 'OPEN',
  COMPETITIVE = 'COMPETITIVE',
  BEAT_LOCKED = 'BEAT_LOCKED',
}

export class CreateCypherDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUrl()
  @IsOptional()
  beatUrl?: string;

  @IsEnum(CypherType)
  cypherType: CypherType;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

