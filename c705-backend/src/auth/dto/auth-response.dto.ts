export class AuthResponseDto {
  access_token: string;
  user: {
    id: string;
    username?: string | null;
    email: string;
    role: string;
  };
  isNewUser?: boolean; // Optional: indicates if user was just created (for OAuth flows)
}

