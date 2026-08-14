import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { TracksService } from './tracks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/permissions.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UploadTrackDto, UploadTrackResponseDto } from './dto/upload-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { SearchTracksDto } from './dto/search-tracks.dto';

@Controller('tracks')
@UseGuards(JwtAuthGuard)
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  /**
   * Upload track endpoint
   * Flow: iOS app sends audio file -> Backend uploads to S3 -> URL saved to database
   * Backend NEVER stores audio files locally
   */
  @Post('upload')
  @UseGuards(PermissionsGuard)
  @RequirePermission('canUploadMusic')
  @UseInterceptors(FileInterceptor('file'))
  async uploadTrack(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: UploadTrackDto,
    @CurrentUser() user: any,
  ): Promise<UploadTrackResponseDto> {
    if (!file) {
      throw new BadRequestException('No audio file provided');
    }

    return this.tracksService.uploadTrack(user.id, file, uploadDto);
  }

  /**
   * Get all tracks for the authenticated user
   */
  @Get('my-tracks')
  async getMyTracks(@CurrentUser() user: any) {
    return this.tracksService.getMyTracks(user.id);
  }

  /**
   * Get user's liked tracks
   */
  @Get('liked')
  async getLikedTracks(
    @CurrentUser() user: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.tracksService.getLikedTracks(user.id, page, limit);
  }

  /**
   * Get popular/trending tracks
   */
  @Get('popular')
  async getPopularTracks(
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('timeRange', new DefaultValuePipe('all')) timeRange: 'day' | 'week' | 'month' | 'all',
  ) {
    return this.tracksService.getPopularTracks(limit, timeRange);
  }

  /**
   * Search tracks
   */
  @Get('search')
  async searchTracks(
    @Query() searchDto: SearchTracksDto,
    @CurrentUser() user?: any,
  ) {
    return this.tracksService.searchTracks(searchDto, user?.id);
  }

  /**
   * Get tracks by artist
   */
  @Get('artist/:artistId')
  async getTracksByArtist(
    @Param('artistId') artistId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.tracksService.getTracksByArtist(artistId, page, limit);
  }

  /**
   * Get all public tracks
   */
  @Get()
  async getAllPublicTracks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('sortBy', new DefaultValuePipe('recent')) sortBy: string,
  ) {
    return this.tracksService.getAllPublicTracks(page, limit, sortBy);
  }

  /**
   * Get a single track by ID (must be last to avoid route conflicts)
   */
  @Get(':id')
  async getTrackById(@Param('id') id: string) {
    return this.tracksService.getTrackById(id);
  }

  /**
   * Delete a track
   */
  @Delete(':id')
  async deleteTrack(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tracksService.deleteTrack(id, user.id);
  }

  /**
   * Update track metadata
   */
  @Put(':id')
  async updateTrack(
    @Param('id') id: string,
    @Body() updateDto: UpdateTrackDto,
    @CurrentUser() user: any,
  ) {
    return this.tracksService.updateTrack(id, user.id, updateDto);
  }

  /**
   * Like a track
   */
  @Post(':id/like')
  async likeTrack(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tracksService.likeTrack(id, user.id);
  }

  /**
   * Unlike a track
   */
  @Delete(':id/like')
  async unlikeTrack(@Param('id') id: string, @CurrentUser() user: any) {
    return this.tracksService.unlikeTrack(id, user.id);
  }
}
