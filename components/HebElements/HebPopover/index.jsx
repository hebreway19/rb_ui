import React from "react";
import { Popover } from "antd";

export const HebPopover = ({...props}) => {
  return (<Popover className={"heb-popover"} overlayClassName={"heb-popover-overlay"} {...props} />)
}