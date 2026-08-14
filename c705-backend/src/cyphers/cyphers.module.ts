import { Module } from '@nestjs/common';
import { CyphersController } from './cyphers.controller';
import { CyphersService } from './cyphers.service';
import { PrismaService } from '../prisma/prisma.service';
import { S3Module } from '../s3/s3.module';

@Module({
  imports: [S3Module],
  controllers: [CyphersController],
  providers: [CyphersService, PrismaService],
  exports: [CyphersService],
})
export class CyphersModule {}

