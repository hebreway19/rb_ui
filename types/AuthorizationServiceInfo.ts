import { ThirdPartyAuthorizationService } from "../constants";

export type AuthorizationServiceInfo = {
  _id?: string;
  name: ThirdPartyAuthorizationService;
  profilePublicUrl?: string;
  profileId?: string;
  deletionConfirmationCode?: number;
}
