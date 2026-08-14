import { IsString, IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  content: string;

  @IsUUID()
  @IsNotEmpty()
  trackId: string;
}

