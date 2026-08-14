import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma/prisma.service';
import { CyphersModule } from '../cyphers/cyphers.module';
import { BeatsModule } from '../beats/beats.module';

@Module({
  imports: [CyphersModule, BeatsModule],
  controllers: [SearchController],
  providers: [SearchService, PrismaService],
})
export class SearchModule {}
