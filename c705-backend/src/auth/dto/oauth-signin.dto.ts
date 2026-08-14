import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Role as RoleEnum } from '../../../../c705_db/generated/prisma/enums';

export class OAuthSignInDto {
  @IsString()
  provider: string; // 'apple' or 'google'

  @IsString()
  identityToken: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: string;
}

