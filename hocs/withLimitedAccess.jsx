import React, { Fragment } from "react";
import { useAuth } from "../shared/hooks";
import { UserRole, UserState } from "../constants";
import { Tooltip } from "antd";
import { useTranslation } from "next-i18next";

export const withLimitedAccess = ({roles = [], states = [UserState.ANY], key, ...props}) => WrappedComponent => {
  const {user} = useAuth();
  const {t} = useTranslation();
  const isVisibleForCurrentUser = user && (roles.includes(UserRole.ANY) || roles.includes(user.role));
  const isDisabledForCurrentUser = user && (!(states.includes(UserState.ANY) || states.includes(user.state)));
  props.disabled = props.disabled || isDisabledForCurrentUser;
  let result = <Fragment key={key}/>;
  if (isVisibleForCurrentUser) {
    if (isDisabledForCurrentUser) {
      props.children = <Tooltip key={key} title={t("tooltips.you_have_no_access")}>{props.children}</Tooltip>;
    }
    result = <WrappedComponent key={key} {...props}/>;
  }
  if (key === 'choose_ulpan' && user.state !== UserState.AWAIT_TO_CHOOSE_ULPAN) {
    result = <Fragment key={key}/>
  }
  return result;
};