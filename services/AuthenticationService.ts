import { ApiEndpoint, CacheMode, HttpContentType, HttpMethod } from "../constants";
import { Session } from "../types";
import { createUseHttpService, HttpService } from "./HttpService";

export class AuthenticationService extends HttpService {

  public async authorizeLocal(userData): Promise<string> {
    return this._sendRequest({
                               uri: ApiEndpoint.AUTH_LOCAL_LOGIN,
                               method: HttpMethod.POST,
                               responseType: HttpContentType.TEXT,
                               body: userData
                             });
  }

  public async sendPasswordRecoveryInstruction(email): Promise<string> {
    let userData = {email: email};
    return this._sendRequest({
                               uri: ApiEndpoint.FORGOT_PASSWORD,
                               method: HttpMethod.POST,
                               responseType: HttpContentType.TEXT,
                               body: userData
                             });
  }

  public async updatePasswordBySessionId(password, sessionId): Promise<Session> {
    let userData = {password};
    return this._sendRequest({
                               uri: `${ApiEndpoint.UPDATE_PASSWORD}/${sessionId}`,
                               method: HttpMethod.POST,
                               body: userData
                             });
  }

  public async localRegistration(userData) {
    return this._sendRequest({
                               uri: ApiEndpoint.AUTH_LOCAL_REGISTER,
                               method: HttpMethod.POST,
                               body: userData
                             });
  }

  public async authorizeWithSession(sessionId): Promise<Session> {
    return this._sendRequest<Session>({
                                        uri: `${ApiEndpoint.SESSION}/${sessionId}`,
                                        method: HttpMethod.GET
                                      });
  }

  public async resendConfirmationLink() {
    return this._sendRequest({
                               uri: ApiEndpoint.RESEND_CONFIRMATION_LINK,
                               method: HttpMethod.POST,
                               responseType: HttpContentType.TEXT,
                               isAuthorized: true
                             });
  }

  public async refreshToken(): Promise<string> {
    return this._sendRequest<string>({
                                       uri: ApiEndpoint.REFRESH_TOKEN,
                                       method: HttpMethod.POST,
                                       cacheMode: CacheMode.NO_CACHE,
                                       responseType: HttpContentType.TEXT,
                                       isAuthorized: true
                                     });
  }
}

export const useAuthenticationService = createUseHttpService(AuthenticationService);