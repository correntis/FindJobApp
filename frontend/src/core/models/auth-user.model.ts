import { User } from './user.model';

export interface AuthUser {
  user: User;
  accessToken: string;
  refreshToken: string;
  telegramLink?: string;
}
