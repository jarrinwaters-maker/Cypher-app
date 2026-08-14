import { Module } from '@nestjs/common';
import { JournalistInvitesController } from './journalist-invites.controller';
import { JournalistInvitesService } from './journalist-invites.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [JournalistInvitesController],
  providers: [JournalistInvitesService, PrismaService],
  exports: [JournalistInvitesService],
})
export class JournalistInvitesModule {}
