import { IsString } from 'class-validator';

export class VerifyJournalistInviteDto {
  @IsString()
  accessCode: string;
}
