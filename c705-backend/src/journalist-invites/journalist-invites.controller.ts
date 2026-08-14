import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { JournalistInvitesService } from './journalist-invites.service';
import { CreateJournalistInviteDto } from './dto/create-invite.dto';
import { VerifyJournalistInviteDto } from './dto/verify-invite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '../../../c705_db/generated/prisma/enums';

@Controller('journalist-invites')
export class JournalistInvitesController {
  constructor(private readonly invitesService: JournalistInvitesService) {}

  /**
   * Create a journalist invite code (Admin only)
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async createInvite(
    @Body() createDto: CreateJournalistInviteDto,
    @CurrentUser() user: any,
  ) {
    return this.invitesService.createInvite(user.id, createDto);
  }

  /**
   * Verify an invite code (Public endpoint - no auth required)
   */
  @Post('verify')
  async verifyInvite(@Body() verifyDto: VerifyJournalistInviteDto) {
    await this.invitesService.verifyAndUseInvite(verifyDto);
    return { valid: true, message: 'Access code is valid' };
  }

  /**
   * Get all invites (Admin only)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllInvites(@CurrentUser() user: any) {
    return this.invitesService.getAllInvites(user.id);
  }

  /**
   * Get unused invites (Admin only)
   */
  @Get('unused')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getUnusedInvites(@CurrentUser() user: any) {
    return this.invitesService.getUnusedInvites(user.id);
  }
}
