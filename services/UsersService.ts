import { ApiEndpoint, HttpMethod } from "../constants";
import { User } from "../types";
import { createUseHttpService, HttpService } from "./HttpService";

type UserQuery = {
  search?: string;
  currentPage?: number;
};

export class UsersService extends HttpService {

  public async getUserByToken(): Promise<User> {
    return this._sendRequest<User>({
                                     method: HttpMethod.GET,
                                     uri: ApiEndpoint.ME,
                                     isAuthorized: true
                                   });
  }

  public async updateCurrentUserPassword(body) {
    return this._sendRequest({
                                           uri: ApiEndpoint.ME,
                                           method: HttpMethod.PUT,
                                           isAuthorized: true,
                                           body: body
                                         });
  }

  public async getUserById(id): Promise<User> {
    return this._sendRequest<User>({
                                           uri: `${ApiEndpoint.USERS}/${id}`,
                                           method: HttpMethod.GET,
                                           isAuthorized: true
                                         });
  }

  public async updateCurrentAuthorizedUser(body): Promise<User> {
    return this._sendRequest<User>({
                                           uri: ApiEndpoint.ME,
                                           method: HttpMethod.PUT,
                                           isAuthorized: true,
                                           body: body
                                         });
  }

  public async updateUserById(id, body) {
    return this._sendRequest<User>({
                                           uri: `${ApiEndpoint.USERS}/${id}`,
                                           method: HttpMethod.PUT,
                                           isAuthorized: true,
                                           body: body
                                         });
  }

  public async updateUsers(users): Promise<User[]> {
    return this._sendRequest<User[]>({
                                             uri: `${ApiEndpoint.USERS}`,
                                             method: HttpMethod.PUT,
                                             isAuthorized: true,
                                             body: users
                                           });
  }

  public async updateUserStatus(id, body): Promise<User> {
    return this._sendRequest<User>({
                                           uri: `${ApiEndpoint.USER_STATE}/${id}`,
                                           method: HttpMethod.PUT,
                                           isAuthorized: true,
                                           body: body
                                         });
  }

  public async getUsers(): Promise<User[]> {
    return this._sendRequest<User[]>({
                                             uri: `${ApiEndpoint.USERS}`,
                                             method: HttpMethod.GET,
                                             isAuthorized: true
                                           });
  }

  public async getUsersByQuery(query?: UserQuery): Promise<User[]> {
    return this._sendRequest<User[]>({
                                             uri: `${ApiEndpoint.USERS}`,
                                             queryParams: query,
                                             method: HttpMethod.GET,
                                             isAuthorized: true
                                           });
  }

  public async removeCurrentUser(): Promise<User> {
    return this._sendRequest<User>({
                                       uri: `${ApiEndpoint.USERS}/remove`,
                                       method: HttpMethod.PUT,
                                       isAuthorized: true
                                     });
  }

  public async recoveryCurrentUser(): Promise<User> {
    return this._sendRequest<User>({
                                     uri: `${ApiEndpoint.USERS}/recovery`,
                                     method: HttpMethod.PUT,
                                     isAuthorized: true
                                   });
  }
}

export const useUsersService = createUseHttpService(UsersService);