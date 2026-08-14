import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

  async likeTrack(trackId: string, userId: string) {
    // Check if track exists
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // Check if already liked
    const existingLike = await this.prisma.trackLike.findUnique({
      where: {
        userId_trackId: {
          userId,
          trackId,
        },
      },
    });

    if (existingLike) {
      throw new BadRequestException('Track already liked');
    }

    // Create like and update count in a transaction
    await this.prisma.$transaction([
      this.prisma.trackLike.create({
        data: {
          userId,
          trackId,
        },
      }),
      this.prisma.track.update({
        where: { id: trackId },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return {
      message: 'Track liked successfully',
      trackId,
    };
  }
}

