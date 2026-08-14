import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CyphersService } from '../cyphers/cyphers.service';
import { BeatsService } from '../beats/beats.service';

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private cyphersService: CyphersService,
    private beatsService: BeatsService,
  ) {}

  /**
   * Universal search across all content types
   * Excludes ADMIN accounts
   */
  async universalSearch(query: string) {
    // Search all categories in parallel
    const [users, cities, cyphers, beats] = await Promise.all([
      this.searchUsers(query),
      this.searchCities(query),
      this.searchCyphers(query),
      this.searchBeats(query),
    ]);

    return {
      users,
      cities,
      cyphers,
      beats,
    };
  }

  /**
   * Search users by username or email (excludes ADMIN)
   */
  private async searchUsers(query: string) {
    const artists = await this.prisma.artistProfile.findMany({
      where: {
        user: {
          role: { not: 'ADMIN' },
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
      },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            role: true,
          },
        },
      },
    });

    return artists.map((artist) => ({
      id: artist.user.id,
      username: artist.user.username,
      email: artist.user.email,
      name: artist.name || artist.user.email,
      city: artist.city,
      avatarUrl: artist.avatarUrl,
      role: artist.user.role,
    }));
  }

  /**
   * Search cities from artist profiles
   */
  private async searchCities(query: string) {
    const cities = await this.prisma.artistProfile.findMany({
      where: {
        city: { contains: query, mode: 'insensitive' },
        user: {
          role: { not: 'ADMIN' },
        },
      },
      select: {
        city: true,
      },
      distinct: ['city'],
      take: 20,
    });

    // Extract unique cities and filter out nulls
    const uniqueCities = Array.from(
      new Set(cities.map((c) => c.city).filter((city): city is string => city !== null)),
    );

    return uniqueCities;
  }

  /**
   * Search cyphers by title or description
   */
  private async searchCyphers(query: string) {
    return this.cyphersService.searchCyphers(query, 20);
  }

  /**
   * Search beats by title or genre
   */
  private async searchBeats(query: string) {
    return this.beatsService.searchBeats(query, 20);
  }
}
