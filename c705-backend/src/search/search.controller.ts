import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * GET /search - Universal search across users, cities, cyphers, and beats
   * Excludes ADMIN accounts from results
   */
  @Get()
  async universalSearch(@Query('q') query: string) {
    if (!query || query.trim().length < 2) {
      return {
        users: [],
        cities: [],
        cyphers: [],
        beats: [],
      };
    }

    return this.searchService.universalSearch(query.trim());
  }
}
