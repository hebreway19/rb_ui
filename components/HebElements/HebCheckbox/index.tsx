import React from "react";
import { Checkbox, CheckboxProps } from "antd";

import classNames from "classnames";

type HebCheckboxProps = CheckboxProps & {
  size?: "default" | "small"
}

export const HebCheckbox = ({size = "default", className = "", ...props}: HebCheckboxProps) => {
  const classNameString = classNames("heb-checkbox",
                                     `heb-checkbox-size__${size}`,
                                     className.split(" "));
  return <Checkbox className={classNameString} {...props} />
}