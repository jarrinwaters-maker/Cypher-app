import { Controller, Post, Get, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /**
   * Get comments for a track
   * GET /comment/track/:trackId
   */
  @Get('track/:trackId')
  async getTrackComments(
    @Param('trackId') trackId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.commentsService.getTrackComments(trackId, page, limit);
  }

  /**
   * Create a comment on a track
   * POST /comment
   */
  @Post()
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.createComment(createCommentDto, user.id);
  }
}

