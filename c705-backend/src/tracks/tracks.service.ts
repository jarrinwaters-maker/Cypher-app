import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { UploadTrackDto, UploadTrackResponseDto } from './dto/upload-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { SearchTracksDto } from './dto/search-tracks.dto';

@Injectable()
export class TracksService {
  constructor(
    private prisma: PrismaService,
    private s3Service: S3Service,
  ) {}

  /**
   * Upload a track: iOS app sends audio file -> Backend uploads to S3 -> URL saved to database
   * Backend NEVER stores audio files locally
   */
  async uploadTrack(
    userId: string,
    file: Express.Multer.File,
    uploadDto: UploadTrackDto,
  ): Promise<UploadTrackResponseDto> {
    // Validate file
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    // Validate audio file type
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/wave',
      'audio/x-wav',
      'audio/mp4',
      'audio/m4a',
      'audio/aac',
      'audio/ogg',
      'audio/webm',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}`,
      );
    }

    // Get or create artist profile
    let artistProfile = await this.prisma.artistProfile.findUnique({
      where: { userId },
    });

    if (!artistProfile) {
      // Create artist profile if it doesn't exist
      artistProfile = await this.prisma.artistProfile.create({
        data: {
          userId,
        },
      });
    }

    // Generate S3 key for the audio file
    const fileExtension = file.originalname.split('.').pop() || 'mp3';
    const s3Key = this.s3Service.generateKey(userId, `${uploadDto.title}.${fileExtension}`, 'music');

    // Upload to S3 - Backend NEVER stores files locally, only streams to S3
    const audioUrl = await this.s3Service.uploadPublicFile(
      file.buffer,
      s3Key,
      file.mimetype,
    );

    // Save URL to database (NOT the file)
    const track = await this.prisma.track.create({
      data: {
        title: uploadDto.title,
        audioUrl, // S3 URL saved here
        artistId: artistProfile.id,
      },
    });

    return {
      id: track.id,
      title: track.title,
      audioUrl: track.audioUrl,
      artistId: track.artistId,
      createdAt: track.createdAt,
      message: 'Track uploaded successfully',
    };
  }

  /**
   * Get all tracks for the authenticated user
   */
  async getMyTracks(userId: string) {
    const artistProfile = await this.prisma.artistProfile.findUnique({
      where: { userId },
      include: {
        tracks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!artistProfile) {
      return { tracks: [] };
    }

    return {
      tracks: artistProfile.tracks,
    };
  }

  /**
   * Get a single track by ID
   */
  async getTrackById(trackId: string) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
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
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  /**
   * Delete a track (and remove from S3)
   */
  async deleteTrack(trackId: string, userId: string) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
      include: {
        artist: true,
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // Verify ownership
    if (track.artist.userId !== userId) {
      throw new ForbiddenException('You can only delete your own tracks');
    }

    // Extract S3 key from URL
    const urlParts = track.audioUrl.split('/');
    const s3Key = urlParts.slice(3).join('/'); // Remove https://bucket.s3.region.amazonaws.com/

    // Delete from S3
    try {
      await this.s3Service.deleteFile(s3Key);
    } catch (error) {
      // Log error but continue with database deletion
      console.error('Failed to delete file from S3:', error);
    }

    // Delete from database
    await this.prisma.track.delete({
      where: { id: trackId },
    });

    return { message: 'Track deleted successfully' };
  }

  /**
   * Get all public tracks
   */
  async getAllPublicTracks(page: number = 1, limit: number = 20, sortBy: string = 'recent') {
    const skip = (page - 1) * limit;

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular') {
      orderBy = { likeCount: 'desc' };
    } else if (sortBy === 'likes') {
      orderBy = { likeCount: 'desc' };
    } else if (sortBy === 'recent') {
      orderBy = { createdAt: 'desc' };
    }

    const [tracks, total] = await Promise.all([
      this.prisma.track.findMany({
        skip,
        take: limit,
        orderBy,
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
        },
      }),
      this.prisma.track.count(),
    ]);

    return {
      tracks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Search tracks
   */
  async searchTracks(searchDto: SearchTracksDto, userId?: string) {
    const { query, artistId, page = 1, limit = 20, sortBy = 'recent' } = searchDto;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query) {
      where.title = {
        contains: query,
        mode: 'insensitive',
      };
    }

    if (artistId) {
      where.artistId = artistId;
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'popular' || sortBy === 'likes') {
      orderBy = { likeCount: 'desc' };
    } else if (sortBy === 'recent') {
      orderBy = { createdAt: 'desc' };
    }

    const [tracks, total] = await Promise.all([
      this.prisma.track.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
          likes: userId
            ? {
                where: { userId },
                select: { id: true },
              }
            : false,
        },
      }),
      this.prisma.track.count({ where }),
    ]);

    // Add isLiked flag if user is authenticated
    const tracksWithLikes = tracks.map((track) => ({
      ...track,
      isLiked: userId && track.likes && track.likes.length > 0,
      likes: undefined, // Remove likes array from response
    }));

    return {
      tracks: tracksWithLikes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Update track metadata
   */
  async updateTrack(trackId: string, userId: string, updateDto: UpdateTrackDto) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
      include: {
        artist: true,
      },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    // Verify ownership
    if (track.artist.userId !== userId) {
      throw new ForbiddenException('You can only update your own tracks');
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id: trackId },
      data: {
        ...(updateDto.title && { title: updateDto.title }),
      },
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
      },
    });

    return updatedTrack;
  }

  /**
   * Get tracks by artist
   */
  async getTracksByArtist(artistId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const artistProfile = await this.prisma.artistProfile.findUnique({
      where: { id: artistId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!artistProfile) {
      throw new NotFoundException('Artist not found');
    }

    const [tracks, total] = await Promise.all([
      this.prisma.track.findMany({
        where: { artistId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.track.count({ where: { artistId } }),
    ]);

    return {
      artist: artistProfile,
      tracks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get popular/trending tracks
   */
  async getPopularTracks(limit: number = 20, timeRange: 'day' | 'week' | 'month' | 'all' = 'all') {
    const now = new Date();
    let dateFilter: Date | undefined;

    switch (timeRange) {
      case 'day':
        dateFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case 'week':
        dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = undefined;
    }

    const where: any = {};
    if (dateFilter) {
      where.createdAt = {
        gte: dateFilter,
      };
    }

    const tracks = await this.prisma.track.findMany({
      where,
      take: limit,
      orderBy: { likeCount: 'desc' },
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
      },
    });

    return {
      tracks,
      timeRange,
    };
  }

  /**
   * Like a track
   */
  async likeTrack(trackId: string, userId: string) {
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

    // Create like and increment count in a transaction
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

    return { message: 'Track liked successfully' };
  }

  /**
   * Unlike a track
   */
  async unlikeTrack(trackId: string, userId: string) {
    const track = await this.prisma.track.findUnique({
      where: { id: trackId },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    const existingLike = await this.prisma.trackLike.findUnique({
      where: {
        userId_trackId: {
          userId,
          trackId,
        },
      },
    });

    if (!existingLike) {
      throw new BadRequestException('Track not liked');
    }

    // Delete like and decrement count in a transaction
    await this.prisma.$transaction([
      this.prisma.trackLike.delete({
        where: {
          userId_trackId: {
            userId,
            trackId,
          },
        },
      }),
      this.prisma.track.update({
        where: { id: trackId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      }),
    ]);

    return { message: 'Track unliked successfully' };
  }

  /**
   * Get user's liked tracks
   */
  async getLikedTracks(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      this.prisma.trackLike.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          track: {
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
            },
          },
        },
      }),
      this.prisma.trackLike.count({ where: { userId } }),
    ]);

    const tracks = likes.map((like) => ({
      ...like.track,
      likedAt: like.createdAt,
    }));

    return {
      tracks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
