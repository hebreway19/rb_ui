import React from "react";
import { InputNumber } from "antd";
import classNames from "classnames";

export const HebInputNumber = ({className = "", ...props}) => {
  const classNameString = classNames("heb-input-number", className.split(" "));
  return <InputNumber className={classNameString} {...props} />
}