import React from "react";
import Icon from "@ant-design/icons";

const FacebookSvg = () => (
  <svg fill="currentColor" width="1em" height="1em" viewBox="0 0 16 33" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.57761 6.52749V11.0257H0.169434V16.5235H3.57761V32.8666H10.5833V16.5235H15.2831C15.2831 16.5235 15.726 13.8873 15.939 11.0028H10.6104V7.24615C10.6104 6.68102 11.3745 5.92642 12.1319 5.92642H15.9458V0.199951H10.7558C3.40518 0.199951 3.57761 5.70429 3.57761 6.52749Z"
      fill="currentColor" />
  </svg>
);

export const FacebookIcon = props => <Icon component={FacebookSvg} style={{color: "#75ECF9", ...props?.style}} {...props} />