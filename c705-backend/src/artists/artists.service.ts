import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all artists with pagination and search
   */
  async getAllArtists(page: number = 1, limit: number = 20, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { username: { contains: search, mode: 'insensitive' } } },
        { city: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [profiles, total] = await Promise.all([
      this.prisma.artistProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              role: true,
            },
          },
          _count: {
            select: {
              tracks: true,
            },
          },
        },
      }),
      this.prisma.artistProfile.count({ where }),
    ]);

    // Get followers count for each artist
    const artistsWithStats = await Promise.all(
      profiles.map(async (profile) => {
        const followersCount = await this.prisma.follow.count({
          where: { followingId: profile.userId },
        });

        return {
          id: profile.id,
          name: profile.name || profile.user.email,
          city: profile.city,
          avatarUrl: profile.avatarUrl,
          followersCount,
          tracksCount: profile._count.tracks,
          user: {
            id: profile.user.id,
            email: profile.user.email,
            username: profile.user.username,
            role: profile.user.role,
          },
        };
      }),
    );

    return {
      artists: artistsWithStats,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get artist profile by ID
   */
  async getArtistProfile(artistId: string, userId?: string) {
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
        tracks: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Latest 10 tracks for preview
        },
        _count: {
          select: {
            tracks: true,
          },
        },
      },
    });

    if (!artistProfile) {
      throw new NotFoundException('Artist not found');
    }

    // Get followers count
    const followersCount = await this.prisma.follow.count({
      where: { followingId: artistProfile.userId },
    });

    // Check if current user is following
    let isFollowing = false;
    if (userId) {
      const follow = await this.prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: userId,
            followingId: artistProfile.userId,
          },
        },
      });
      isFollowing = !!follow;
    }

    return {
      id: artistProfile.id,
      name: artistProfile.name || artistProfile.user.email,
      bio: artistProfile.bio,
      email: artistProfile.user.email,
      role: artistProfile.user.role,
      city: artistProfile.city,
      avatarUrl: artistProfile.avatarUrl,
      instagramUrl: artistProfile.instagramUrl,
      youtubeUrl: artistProfile.youtubeUrl,
      xUrl: artistProfile.xUrl,
      tiktokUrl: artistProfile.tiktokUrl,
      followersCount,
      tracksCount: artistProfile._count.tracks,
      tracks: artistProfile.tracks,
      isFollowing,
      createdAt: artistProfile.createdAt,
    };
  }

  /**
   * Get artist's tracks with pagination
   */
  async getArtistTracks(artistId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const artistProfile = await this.prisma.artistProfile.findUnique({
      where: { id: artistId },
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
      this.prisma.track.count({ where: { artistId } }),
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
   * Follow an artist
   */
  async followArtist(artistId: string, userId: string) {
    const artistProfile = await this.prisma.artistProfile.findUnique({
      where: { id: artistId },
    });

    if (!artistProfile) {
      throw new NotFoundException('Artist not found');
    }

    if (artistProfile.userId === userId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    // Check if already following
    const existingFollow = await this.prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: userId,
          followingId: artistProfile.userId,
        },
      },
    });

    if (existingFollow) {
      throw new BadRequestException('Already following this artist');
    }

    // Create follow relationship
    await this.prisma.follow.create({
      data: {
        followerId: userId,
        followingId: artistProfile.userId,
      },
    });

    return {
      message: 'Successfully followed artist',
      artistId,
    };
  }

  /**
   * Unfollow an artist
   */
  async unfollowArtist(artistId: string, userId: string) {
    const artistProfile = await this.prisma.artistProfile.findUnique({
      where: { id: artistId },
    });

    if (!artistProfile) {
      throw new NotFoundException('Artist not found');
    }

    // Delete follow relationship
    const deleted = await this.prisma.follow.deleteMany({
      where: {
        followerId: userId,
        followingId: artistProfile.userId,
      },
    });

    if (deleted.count === 0) {
      throw new BadRequestException('Not following this artist');
    }

    return {
      message: 'Successfully unfollowed artist',
      artistId,
    };
  }

  /**
   * Get artist's followers
   */
  async getFollowers(artistId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const artistProfile = await this.prisma.artistProfile.findUnique({
      where: { id: artistId },
    });

    if (!artistProfile) {
      throw new NotFoundException('Artist not found');
    }

    const [follows, total] = await Promise.all([
      this.prisma.follow.findMany({
        where: { followingId: artistProfile.userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          follower: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      this.prisma.follow.count({
        where: { followingId: artistProfile.userId },
      }),
    ]);

    return {
      followers: follows.map((follow) => ({
        id: follow.follower.id,
        email: follow.follower.email,
        role: follow.follower.role,
        followedAt: follow.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

