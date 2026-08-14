import { IsUUID, IsNotEmpty } from 'class-validator';

export class LikeDto {
  @IsUUID()
  @IsNotEmpty()
  trackId: string;
}

