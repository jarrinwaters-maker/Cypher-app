import { Module } from '@nestjs/common';
import { PayoutsController } from './payouts.controller';
import { PayoutsService } from './payouts.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PayoutsController],
  providers: [PayoutsService, PrismaService],
  exports: [PayoutsService],
})
export class PayoutsModule {}

