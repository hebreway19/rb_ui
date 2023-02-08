import React from "react";
import Icon from "@ant-design/icons";
import VkSvg from "./vk.svg";

export const VkIcon = props => <Icon component={VkSvg} style={{color: "#75ECF9", ...props?.style}} {...props} />