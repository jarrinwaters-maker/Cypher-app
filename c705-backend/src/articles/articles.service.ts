import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { SearchArticlesDto } from './dto/search-articles.dto';
import { Role as RoleEnum } from '../../../c705_db/generated/prisma/enums';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create article - Only ADMIN and JOURNALIST can create
   */
  async createArticle(userId: string, createDto: CreateArticleDto) {
    // Verify user has permission (should be checked by guard, but double-check)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || (user.role !== RoleEnum.ADMIN && user.role !== RoleEnum.JOURNALIST)) {
      throw new ForbiddenException('Only admins and journalists can create articles');
    }

    const article = await this.prisma.article.create({
      data: {
        title: createDto.title,
        content: createDto.content,
        city: createDto.city,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return article;
  }

  /**
   * Get all articles from the last 3 days (read-only for iOS app)
   */
  async getAllArticles(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    // Calculate date 3 days ago at start of day (00:00:00 UTC)
    const now = new Date();
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setUTCDate(now.getUTCDate() - 3);
    threeDaysAgo.setUTCHours(0, 0, 0, 0); // Set to start of day in UTC
    
    const where = {
      createdAt: {
        gte: threeDaysAgo,
      },
    };

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get article by ID (read-only for iOS app)
   */
  async getArticleById(id: string) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  /**
   * Search articles (read-only for iOS app)
   */
  async searchArticles(searchDto: SearchArticlesDto) {
    const { query, city, authorId, page = 1, limit = 20 } = searchDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (city) {
      where.city = {
        contains: city,
        mode: 'insensitive',
      };
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get articles by author (read-only for iOS app)
   */
  async getArticlesByAuthor(authorId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const author = await this.prisma.user.findUnique({
      where: { id: authorId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where: { authorId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.article.count({ where: { authorId } }),
    ]);

    return {
      author,
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update article - Only ADMIN and JOURNALIST can update
   * Journalists can only update their own articles
   * Admins can update any article
   */
  async updateArticle(articleId: string, userId: string, updateDto: UpdateArticleDto) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Admins can update any article, journalists can only update their own
    if (user.role !== RoleEnum.ADMIN && article.authorId !== userId) {
      throw new ForbiddenException('You can only update your own articles');
    }

    if (user.role !== RoleEnum.ADMIN && user.role !== RoleEnum.JOURNALIST) {
      throw new ForbiddenException('Only admins and journalists can update articles');
    }

    const updatedArticle = await this.prisma.article.update({
      where: { id: articleId },
      data: {
        ...(updateDto.title && { title: updateDto.title }),
        ...(updateDto.content && { content: updateDto.content }),
        ...(updateDto.city && { city: updateDto.city }),
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return updatedArticle;
  }

  /**
   * Delete article - Only ADMIN and JOURNALIST can delete
   * Journalists can only delete their own articles
   * Admins can delete any article
   */
  async deleteArticle(articleId: string, userId: string) {
    const article = await this.prisma.article.findUnique({
      where: { id: articleId },
      include: {
        author: true,
      },
    });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Admins can delete any article, journalists can only delete their own
    if (user.role !== RoleEnum.ADMIN && article.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own articles');
    }

    if (user.role !== RoleEnum.ADMIN && user.role !== RoleEnum.JOURNALIST) {
      throw new ForbiddenException('Only admins and journalists can delete articles');
    }

    await this.prisma.article.delete({
      where: { id: articleId },
    });

    return { message: 'Article deleted successfully' };
  }

  /**
   * Get my articles (for journalists/admins to see their own articles)
   */
  async getMyArticles(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where: { authorId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.article.count({ where: { authorId: userId } }),
    ]);

    return {
      articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
