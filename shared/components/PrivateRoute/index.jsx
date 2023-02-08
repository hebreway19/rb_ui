import { message } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { RoutePath, UserRole, UserState } from "../../../constants";
import { useAuth } from "../../hooks";

const stateRestrictions = [
  {
    state: UserState.AWAIT_TO_CHOOSE_ULPAN,
    path: RoutePath.PROFILE_ULPAN()
  },
  {
    state: UserState.AWAIT_EMAIL_CONFIRMATION,
    path: RoutePath.REGISTRATION_CHECK_MAIL()
  },
  {
    state: UserState.AWAIT_REVIEW_BY_ULPAN,
    path: RoutePath.PROFILE_OTHER()
  }
];

export const PrivateRoute = ({children, roles = [UserRole.ANY], states=[UserState.ANY], ...props}) => {
  const {user} = useAuth();
  const {t} = useTranslation()
  const {pathname} = useLocation();
  const renderForAuthorizedUser = useCallback(({location}) => {
    return user
      ? (children)
      : (<Redirect to={{pathname: RoutePath.LOGIN(), state: {from: location}}}/>)
  }, [user, children]);

  const renderForAuthorizedUserWithAllowedRolesAndStates = ({location}) => {
    const fromPathname = location.from ? location.from.pathname : RoutePath.PROFILE();
    const isAllowedForRoleOfCurrentUser = (roles.includes(UserRole.ANY) || (user && roles.includes(user.role)));
    const isAllowedForStateOfCurrentUser = (states.includes(UserState.ANY) || (user && states.includes(user.state)));
    (user && !isAllowedForRoleOfCurrentUser) && message.warn(t("messages.not_access.role"));
    (user && !isAllowedForStateOfCurrentUser) && message.warn(t("messages.not_access.state"))
    const result = (user && isAllowedForRoleOfCurrentUser && isAllowedForStateOfCurrentUser)
      ? (children)
      : (<Redirect to={{pathname: fromPathname, state: {from: location}}}/>);
    return (result);
  };

  let render = user
    ? roles && roles.length
      ? renderForAuthorizedUserWithAllowedRolesAndStates
      : renderForAuthorizedUser
    : ({location}) => (<Redirect to={{pathname: RoutePath.LOGIN(), state: {from: location}}}/>);

  for (const {state, path} in stateRestrictions) {
    if (user && user.state === state && pathname !== path) {
      render = ({location}) => (<Redirect to={{pathname: path, state: {from: location}}}/>)
      break;
    }
  }
  return (
    <Route
      {...props}
      render={render}
    />
  );
};

 PrivateRoute;