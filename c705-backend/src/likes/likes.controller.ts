import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { LikeDto } from './dto/like.dto';

@Controller('like')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  /**
   * Like a track (simplified endpoint)
   * POST /like
   */
  @Post()
  async likeTrack(
    @Body() likeDto: LikeDto,
    @CurrentUser() user: any,
  ) {
    return this.likesService.likeTrack(likeDto.trackId, user.id);
  }
}

