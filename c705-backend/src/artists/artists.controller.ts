import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('artists')
@UseGuards(JwtAuthGuard)
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  /**
   * Get all artists (list)
   * GET /artists
   */
  @Get()
  async getAllArtists(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ) {
    return this.artistsService.getAllArtists(page, limit, search);
  }

  /**
   * Get artist profile
   * GET /artists/:id
   */
  @Get(':id')
  async getArtistProfile(
    @Param('id') artistId: string,
    @CurrentUser() user: any,
  ) {
    return this.artistsService.getArtistProfile(artistId, user.id);
  }

  /**
   * Get artist's tracks
   * GET /artists/:id/tracks
   */
  @Get(':id/tracks')
  async getArtistTracks(
    @Param('id') artistId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.artistsService.getArtistTracks(artistId, page, limit);
  }

  /**
   * Follow an artist
   * POST /artists/:id/follow
   */
  @Post(':id/follow')
  async followArtist(
    @Param('id') artistId: string,
    @CurrentUser() user: any,
  ) {
    return this.artistsService.followArtist(artistId, user.id);
  }

  /**
   * Unfollow an artist
   * DELETE /artists/:id/follow
   */
  @Delete(':id/follow')
  async unfollowArtist(
    @Param('id') artistId: string,
    @CurrentUser() user: any,
  ) {
    return this.artistsService.unfollowArtist(artistId, user.id);
  }

  /**
   * Get artist's followers
   * GET /artists/:id/followers
   */
  @Get(':id/followers')
  async getFollowers(
    @Param('id') artistId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.artistsService.getFollowers(artistId, page, limit);
  }
}

