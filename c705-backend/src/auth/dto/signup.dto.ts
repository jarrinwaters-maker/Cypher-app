import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { Role as RoleEnum } from '../../../../c705_db/generated/prisma/enums';

export class SignupDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  username?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @IsOptional()
  @IsString()
  accessCode?: string; // For journalist signup
}

