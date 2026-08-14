import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateJournalistInviteDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
