import React from "react";
import Icon from "@ant-design/icons";
import { ReactComponent as Logo } from "./hebreway.svg";


export const HebrewayLogoIcon = ({...props}) => {
  return <Icon className="logo" component={Logo} {...props} viewBox="0 0 81 81"/>
};