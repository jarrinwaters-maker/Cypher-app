# Authentication & Role-Based Access Control (RBAC)

This module provides authentication and role-based access control for the application.

## Roles and Permissions

### ARTIST
- ✅ Upload music
- ✅ Rap battle with other people
- ✅ Purchase beats

### ADMIN
- ✅ Full control to make any change
- ✅ Changes reflect to all users
- ✅ All permissions

### ENGINEER
- ✅ Upload beats to sell
- ✅ View-only access to other sections

### JOURNALIST
- ✅ Write and post articles
- ✅ View-only access to other sections

### PRODUCER
- ✅ Speak to everyone (artist, engineers, journalist)
- ✅ Buy beats
- ✅ Listen to freestyle battles

## Usage Examples

### Protecting Routes with JWT Authentication

```typescript
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('music')
@UseGuards(JwtAuthGuard)
export class MusicController {
  @Get('my-tracks')
  getMyTracks(@CurrentUser() user: CurrentUser) {
    // user.id, user.email, user.role available here
    return { message: 'Your tracks' };
  }
}
```

### Restricting by Role

```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../../../c705_db/generated/prisma/enums';

@Controller('beats')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BeatsController {
  @Post('upload')
  @Roles(Role.ENGINEER, Role.ADMIN)
  uploadBeat() {
    return { message: 'Beat uploaded' };
  }
}
```

### Using Permission-Based Access

```typescript
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/permissions.decorator';

@Controller('articles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ArticlesController {
  @Post()
  @RequirePermission('canWriteArticles')
  createArticle() {
    return { message: 'Article created' };
  }
}
```

### Multiple Roles

```typescript
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  @Post('settings')
  @Roles(Role.ADMIN) // Only admins
  updateSettings() {
    return { message: 'Settings updated' };
  }

  @Get('analytics')
  @Roles(Role.ADMIN, Role.ENGINEER, Role.JOURNALIST) // Multiple roles
  getAnalytics() {
    return { message: 'Analytics data' };
  }
}
```

## Available Decorators

- `@CurrentUser()` - Get the current authenticated user
- `@Roles(...roles)` - Restrict access to specific roles
- `@RequirePermission(...permissions)` - Require specific permissions

## Available Guards

- `JwtAuthGuard` - Validates JWT token
- `RolesGuard` - Checks if user has required role
- `PermissionsGuard` - Checks if user has required permissions

## Combining Guards

Guards are executed in order. Always use `JwtAuthGuard` first to ensure the user is authenticated:

```typescript
@UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
```

