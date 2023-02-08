import {AuthUser} from "../types";
import {RoutePath, UserRole, UserState} from "../constants";
import {UrlObject} from "url";
import {DefaultStatePages, PagesRestrictions} from "../config";
import {RedirectRoutePath} from "../config/PagesRestrictions";

type FilterFunction = (redirectRoutePath?: RedirectRoutePath, user?: AuthUser) => UrlObject | null;

export class SecurityUtil {
  private constructor() {
  }

  public static getRedirectRouteByUserAndCurrentPathName(user: AuthUser, currentPathName: string): UrlObject {
    let resultRedirect: UrlObject;
    const pageAccessRequirements = PagesRestrictions.find(routePath => routePath.pathname === currentPathName);
    resultRedirect = this.goOverTheChain([
                                           this.filterByUser,
                                           this.filterByState,
                                           this.filterByRole
                                         ], pageAccessRequirements, user);
    return resultRedirect;
  }

  private static goOverTheChain(filters: FilterFunction[], redirectRoutePath?: RedirectRoutePath, user?: AuthUser): UrlObject {
    let resultRedirect: UrlObject;
    for (const filter of filters) {
      resultRedirect = filter(redirectRoutePath, user);
      if (resultRedirect) {
        break;
      }
    }
    return resultRedirect;
  }

  private static filterByUser: FilterFunction = (redirectRoutePath?: RedirectRoutePath, user?: AuthUser) => {
    let resultRedirect: UrlObject;
    if (redirectRoutePath && !user) {
      resultRedirect = {pathname: RoutePath.LOGIN()};
    }
    return resultRedirect;
  };

  private static filterByRole: FilterFunction = (redirectRoutePath?: RedirectRoutePath, user?: AuthUser) => {
    let resultRedirect: UrlObject;
    if (redirectRoutePath && !(redirectRoutePath.hasAnyRoles.includes(UserRole.ANY) || redirectRoutePath.hasAnyRoles.includes(user?.role))) {
      resultRedirect = {pathname: RoutePath.PROFILE()};
    }
    return resultRedirect;
  };

  private static filterByState: FilterFunction = (redirectRoutePath?: RedirectRoutePath, user?: AuthUser) => {
    let resultRedirect: UrlObject;
    if (redirectRoutePath && !(redirectRoutePath.allowedState.includes(UserState.ANY) || redirectRoutePath.allowedState.includes(user?.state))) {
      const foundRedirectRoute = DefaultStatePages.find(stateRestriction => stateRestriction.state === user.state);
      resultRedirect = { pathname: foundRedirectRoute?.pathname || RoutePath.LOGIN() };
    }
    return resultRedirect;
  };
}