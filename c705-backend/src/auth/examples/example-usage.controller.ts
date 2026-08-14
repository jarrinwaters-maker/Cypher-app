/**
 * Example controller demonstrating role-based access control usage
 * This file is for reference only - delete or use as a template for your actual controllers
 */

import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { PermissionsGuard } from '../guards/permissions.guard';
import { Roles } from '../decorators/roles.decorator';
import { RequirePermission } from '../decorators/permissions.decorator';
import { CurrentUser, CurrentUser as User } from '../decorators/current-user.decorator';
import { Role } from '../../../../c705_db/generated/prisma/enums';

@Controller('example')
export class ExampleUsageController {
  // Example 1: Protected route - requires authentication only
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return {
      message: 'Your profile',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  // Example 2: Artist-only route - upload music
  @Post('music/upload')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('canUploadMusic')
  uploadMusic(@CurrentUser() user: User) {
    return { message: 'Music uploaded successfully', userId: user.id };
  }

  // Example 3: Engineer-only route - upload beats
  @Post('beats/upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ENGINEER, Role.ADMIN)
  uploadBeat(@CurrentUser() user: User) {
    return { message: 'Beat uploaded successfully', userId: user.id };
  }

  // Example 4: Journalist-only route - write articles
  @Post('articles')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('canWriteArticles')
  createArticle(@CurrentUser() user: User) {
    return { message: 'Article created successfully', authorId: user.id };
  }

  // Example 5: Artist and Producer - rap battle
  @Post('battles/start')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('canRapBattle')
  startBattle(@CurrentUser() user: User) {
    return { message: 'Battle started', participantId: user.id };
  }

  // Example 6: Producer and Artist - purchase beats
  @Post('beats/purchase')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('canPurchaseBeats')
  purchaseBeat(@CurrentUser() user: User) {
    return { message: 'Beat purchased', buyerId: user.id };
  }

  // Example 7: Producer - speak to everyone
  @Post('messages/send')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('canSpeakToEveryone')
  sendMessage(@CurrentUser() user: User) {
    return { message: 'Message sent', senderId: user.id };
  }

  // Example 8: Producer - listen to battles
  @Get('battles/listen')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('canListenToBattles')
  listenToBattles(@CurrentUser() user: User) {
    return { message: 'Listening to battles', listenerId: user.id };
  }

  // Example 9: Admin-only - modify app settings
  @Post('admin/settings')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  updateSettings(@CurrentUser() user: User) {
    return { message: 'Settings updated', adminId: user.id };
  }

  // Example 10: View-only access (Engineer, Journalist)
  @Get('view-all')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('canViewAll')
  viewAllContent(@CurrentUser() user: User) {
    return { message: 'View-only access granted', viewerId: user.id };
  }
}

