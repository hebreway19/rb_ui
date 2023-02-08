import React from "react";
import { Tabs } from "antd";

import classNames from "classnames";

export const HebTabs = ({className = "", ...props}) => {
  const classNameString = classNames("heb-tabs",
                                     className.split(" "));
  return <Tabs className={classNameString} {...props} />
}