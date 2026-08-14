import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get comments for a track
   */
  async getTrackComments(trackId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    // Verify track exists
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { trackId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.comment.count({
        where: { trackId },
      }),
    ]);

    return {
      comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createComment(createCommentDto: CreateCommentDto, userId: string) {
    const { content, trackId } = createCommentDto;

    // Verify track exists
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // Create comment
    const comment = await this.prisma.comment.create({
      data: {
        content,
        trackId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
        track: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return {
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      user: comment.user,
      track: comment.track,
      message: 'Comment created successfully',
    };
  }
}

