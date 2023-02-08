import {ThirdPartyAuthorizationService} from "../../../constants";
import {AppleIcon} from "../../../shared/icons/Apple";
import {FacebookIcon} from "../../../shared/icons/Facebook";
import {VkIcon} from "../../../shared/icons/Vk";
import {GoogleIcon} from "../../../shared/icons/Google";

export class SocialIconFactory {
  private static [ThirdPartyAuthorizationService.APPLE] = AppleIcon;
  private static [ThirdPartyAuthorizationService.FACEBOOK] = FacebookIcon;
  private static [ThirdPartyAuthorizationService.VKONTAKTE] = VkIcon;
  private static [ThirdPartyAuthorizationService.GOOGLE] = GoogleIcon;

  public static build(socialName: ThirdPartyAuthorizationService) {
    return this[socialName];
  }
}