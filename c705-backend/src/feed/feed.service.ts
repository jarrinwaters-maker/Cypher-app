import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedService {
  constructor(private prisma: PrismaService) {}

  async getFeed(page: number, limit: number, userId?: string) {
    const skip = (page - 1) * limit;

    // Fetch tracks and articles in parallel
    const [tracks, articles, tracksCount, articlesCount] = await Promise.all([
      this.prisma.track.findMany({
        skip,
        take: Math.ceil(limit / 2), // Half for tracks
        orderBy: { createdAt: 'desc' },
        include: {
          artist: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  role: true,
                },
              },
            },
          },
          likes: userId ? {
            where: { userId },
            select: { id: true },
          } : false,
        },
      }),
      this.prisma.article.findMany({
        skip,
        take: Math.ceil(limit / 2), // Half for articles
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
      this.prisma.track.count(),
      this.prisma.article.count(),
    ]);

    // Combine and sort by creation date
    const feedItems = [
      ...tracks.map(track => ({
        type: 'track' as const,
        id: track.id,
        title: track.title,
        audioUrl: track.audioUrl,
        likeCount: track.likeCount,
        isLiked: userId ? track.likes && track.likes.length > 0 : false,
        createdAt: track.createdAt,
        artist: {
          id: track.artist.id,
          bio: track.artist.bio,
          user: track.artist.user,
        },
      })),
      ...articles.map(article => ({
        type: 'article' as const,
        id: article.id,
        title: article.title,
        content: article.content,
        city: article.city,
        createdAt: article.createdAt,
        author: article.author,
      })),
    ]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);

    const total = tracksCount + articlesCount;
    const totalPages = Math.ceil(total / limit);

    return {
      feed: feedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }
}

