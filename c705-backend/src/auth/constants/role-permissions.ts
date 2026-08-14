import { Role as RoleEnum, Role } from '../../../../c705_db/generated/prisma/enums';

/**
 * Role-based permissions configuration
 * 
 * ARTIST:
 * - Upload music
 * - Rap battle with other people
 * - Purchase beats
 * 
 * ADMIN:
 * - Full control to make any change
 * - Changes reflect to all users
 * 
 * ENGINEER:
 * - Upload beats to sell
 * - View-only access to other sections
 * 
 * JOURNALIST:
 * - Write and post articles
 * - View-only access to other sections
 * 
 * PRODUCER:
 * - Speak to everyone (artist, engineers, journalist)
 * - Buy beats
 * - Listen to freestyle battles
 */

export const ROLE_PERMISSIONS = {
  [RoleEnum.ARTIST]: {
    canUploadMusic: true,
    canRapBattle: true,
    canPurchaseBeats: true,
    canUploadBeats: false,
    canWriteArticles: false,
    canModifyAppSettings: false,
    canViewAll: false,
    canSpeakToEveryone: false,
    canListenToBattles: false,
  },
  [RoleEnum.ADMIN]: {
    canUploadMusic: true,
    canRapBattle: true,
    canPurchaseBeats: true,
    canUploadBeats: true,
    canWriteArticles: true,
    canModifyAppSettings: true,
    canViewAll: true,
    canSpeakToEveryone: true,
    canListenToBattles: true,
  },
  [RoleEnum.ENGINEER]: {
    canUploadMusic: false,
    canRapBattle: false,
    canPurchaseBeats: false,
    canUploadBeats: true,
    canWriteArticles: false,
    canModifyAppSettings: false,
    canViewAll: true, // View-only
    canSpeakToEveryone: false,
    canListenToBattles: false,
  },
  [RoleEnum.JOURNALIST]: {
    canUploadMusic: false,
    canRapBattle: false,
    canPurchaseBeats: false,
    canUploadBeats: false,
    canWriteArticles: true,
    canModifyAppSettings: false,
    canViewAll: true, // View-only
    canSpeakToEveryone: false,
    canListenToBattles: false,
  },
  [RoleEnum.PRODUCER]: {
    canUploadMusic: false,
    canRapBattle: false,
    canPurchaseBeats: true,
    canUploadBeats: false,
    canWriteArticles: false,
    canModifyAppSettings: false,
    canViewAll: false,
    canSpeakToEveryone: true,
    canListenToBattles: true,
  },
} as const;

export type Permission = keyof typeof ROLE_PERMISSIONS[typeof Role.ADMIN];

export function hasPermission(role: RoleEnum, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.[permission] ?? false;
}

