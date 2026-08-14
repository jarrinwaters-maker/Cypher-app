import { Controller, Get, Query } from '@nestjs/common';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  /**
   * Get hip-hop news articles
   * GET /news/hip-hop?query=optional_search_term
   */
  @Get('hip-hop')
  async getHipHopNews(@Query('query') query?: string) {
    const articles = await this.newsService.getHipHopNews(query);
    return {
      articles,
      total: articles.length,
    };
  }
}

