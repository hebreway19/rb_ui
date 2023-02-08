import { ApiEndpoint, HttpMethod } from "../constants";
import { RequestUtil } from "../util/RequestUtil";

export class UserAgreementService {

  static async updateUserAgreement(agreement) {
    return await RequestUtil.sendRequest({
      uri: ApiEndpoint.AGREEMENT,
      method: HttpMethod.PUT,
      isAuthorized: true,
      body: agreement
    });
  }

  static async getAgreement() {
    const [agreement] = await RequestUtil.sendRequest({
      uri: ApiEndpoint.AGREEMENT,
      method: HttpMethod.GET,
      isAuthorized: true,
    })
    return agreement;
  }

}

export default UserAgreementService;