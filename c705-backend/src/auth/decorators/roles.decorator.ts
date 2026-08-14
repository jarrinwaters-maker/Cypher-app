import { SetMetadata } from '@nestjs/common';
import { Role as RoleEnum } from '../../../../c705_db/generated/prisma/enums';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleEnum[]) => SetMetadata(ROLES_KEY, roles);

