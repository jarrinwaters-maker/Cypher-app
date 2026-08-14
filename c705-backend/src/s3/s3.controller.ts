import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadFileResponseDto } from './dto/upload-file.dto';

@Controller('s3')
@UseGuards(JwtAuthGuard)
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: any,
  ): Promise<UploadFileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const key = this.s3Service.generateKey(user.id, file.originalname);
    const url = await this.s3Service.uploadPublicFile(
      file.buffer,
      key,
      file.mimetype,
    );

    return {
      url,
      key,
      message: 'File uploaded successfully',
    };
  }

  @Post('upload/:folder')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFileToFolder(
    @UploadedFile() file: Express.Multer.File,
    @Param('folder') folder: string,
    @CurrentUser() user: any,
  ): Promise<UploadFileResponseDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const key = this.s3Service.generateKey(user.id, file.originalname, folder);
    const url = await this.s3Service.uploadPublicFile(
      file.buffer,
      key,
      file.mimetype,
    );

    return {
      url,
      key,
      message: 'File uploaded successfully',
    };
  }

  @Get('presigned-url/:key')
  async getPresignedUrl(@Param('key') key: string): Promise<{ url: string }> {
    const url = await this.s3Service.getPresignedUrl(key);
    return { url };
  }

  @Get('exists/:key')
  async checkFileExists(@Param('key') key: string): Promise<{ exists: boolean }> {
    const exists = await this.s3Service.fileExists(key);
    return { exists };
  }

  @Delete(':key')
  async deleteFile(@Param('key') key: string): Promise<{ message: string }> {
    await this.s3Service.deleteFile(key);
    return { message: 'File deleted successfully' };
  }
}

