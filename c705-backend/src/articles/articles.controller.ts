import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticlesDto } from './dto/search-articles.dto';
import { Role } from '../../../c705_db/generated/prisma/enums';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  /**
   * Get all articles (GUEST ACCESS - No auth required)
   */
  @Get()
  async getAllArticles(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.articlesService.getAllArticles(page, limit);
  }

  /**
   * Search articles (GUEST ACCESS - No auth required)
   */
  @Get('search')
  async searchArticles(@Query() searchDto: SearchArticlesDto) {
    return this.articlesService.searchArticles(searchDto);
  }

  /**
   * Get article by ID (GUEST ACCESS - No auth required)
   */
  @Get(':id')
  async getArticleById(@Param('id') id: string) {
    return this.articlesService.getArticleById(id);
  }

  /**
   * Get articles by author (GUEST ACCESS - No auth required)
   */
  @Get('author/:authorId')
  async getArticlesByAuthor(
    @Param('authorId') authorId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.articlesService.getArticlesByAuthor(authorId, page, limit);
  }

  /**
   * Get my articles (for journalists/admins - AUTH REQUIRED)
   */
  @Get('my-articles')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.JOURNALIST)
  async getMyArticles(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.articlesService.getMyArticles(user.id, page, limit);
  }

  /**
   * Create article - ONLY ADMIN and JOURNALIST can create (AUTH REQUIRED)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.JOURNALIST)
  async createArticle(
    @Body() createDto: CreateArticleDto,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.createArticle(user.id, createDto);
  }

  /**
   * Update article - ONLY ADMIN and JOURNALIST can update (AUTH REQUIRED)
   * Journalists can only update their own articles
   * Admins can update any article
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.JOURNALIST)
  async updateArticle(
    @Param('id') id: string,
    @Body() updateDto: UpdateArticleDto,
    @CurrentUser() user: any,
  ) {
    return this.articlesService.updateArticle(id, user.id, updateDto);
  }

  /**
   * Delete article - ONLY ADMIN and JOURNALIST can delete (AUTH REQUIRED)
   * Journalists can only delete their own articles
   * Admins can delete any article
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.JOURNALIST)
  async deleteArticle(@Param('id') id: string, @CurrentUser() user: any) {
    return this.articlesService.deleteArticle(id, user.id);
  }
}
