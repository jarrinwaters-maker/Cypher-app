import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for inviting a user to a cypher
 * Note: artistId field name is kept for backward compatibility, but any user can be invited
 */
export class InviteArtistDto {
  @IsString()
  @IsNotEmpty()
  artistId: string; // User ID of the person being invited (can be any role)
}

export class RespondToInviteDto {
  @IsString()
  @IsNotEmpty()
  response: 'accepted' | 'declined';
}

