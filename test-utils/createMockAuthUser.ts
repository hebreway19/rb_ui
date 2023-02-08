import { LanguageCode, UserRole, UserState } from "../constants";
import { AuthUser } from "../types";

export function createMockAuthUser(newProps: Partial<AuthUser> = {}): AuthUser {
  return ({
    userId: "userId",
    createdAt: 0,
    email: "string",
    expiresAt: 1000,
    iat: 1,
    interfaceLanguage: LanguageCode.RU,
    photoUrl: "string",
    role: UserRole.STUDENT,
    state: UserState.ACTIVE,
    ...newProps
  })
}