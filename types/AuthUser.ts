import { LanguageCode, UserRole, UserState } from "../constants";

export type AuthUser = {
  userId?: string;
  createdAt: number;
  email:string;
  expiresAt: number;
  iat: number;
  interfaceLanguage: LanguageCode;
  photoUrl: string;
  role: UserRole;
  state: UserState;
};