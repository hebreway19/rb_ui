import { AuthUser } from "./AuthUser";
import { User } from "./User";

export type Auth = {
  user?: AuthUser;
  token?: string;

  updateCurrentAuthorizedUser(updatedUser: User): Promise<void>;
  refreshToken(callback?): Promise<void>;
  signInBySessionId(sessionId: string): Promise<void>;
  signInByUsernameAndPassword(email: string, password: string): Promise<void>;
  resendConfirmationLink(callback?): Promise<void>;
  signOut(): Promise<void>;
  setToken(newToken: string): Promise<void> | void;
};