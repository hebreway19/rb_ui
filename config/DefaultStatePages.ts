import {RoutePath, UserState} from "../constants";


export const DefaultStatePages = [
  {
    state: UserState.ACTIVE,
    pathname: RoutePath.PROFILE()
  },
  {
    state: UserState.AWAIT_TO_CHOOSE_ULPAN,
    pathname: RoutePath.PROFILE_ULPAN()
  },
  {
    state: UserState.AWAIT_EMAIL_CONFIRMATION,
    pathname: RoutePath.REGISTRATION_CHECK_MAIL()
  },
  {
    state: UserState.AWAIT_REVIEW_BY_ULPAN,
    pathname: RoutePath.PROFILE_OTHER()
  },
  {
    state: UserState.DELETED,
    pathname: RoutePath.USER_RECOVERY
  }
]