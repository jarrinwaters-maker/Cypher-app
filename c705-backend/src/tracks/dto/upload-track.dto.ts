import { IsString, IsNotEmpty } from 'class-validator';

export class UploadTrackDto {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class UploadTrackResponseDto {
  id: string;
  title: string;
  audioUrl: string;
  artistId: string;
  createdAt: Date;
  message: string;
}

