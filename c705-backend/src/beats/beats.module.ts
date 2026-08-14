import { Module } from '@nestjs/common';
import { BeatsController } from './beats.controller';
import { BeatsService } from './beats.service';
import { PrismaService } from '../prisma/prisma.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [BeatsController],
  providers: [BeatsService, PrismaService],
  exports: [BeatsService],
})
export class BeatsModule {}

