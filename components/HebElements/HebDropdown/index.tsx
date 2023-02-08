import React from "react";
import { Dropdown } from "antd";
import { DropdownProps } from "antd/lib/dropdown/dropdown";

type HebDropdownProps = DropdownProps & {
  children: React.ReactNodeArray | React.ReactNode[] | React.ReactNode;
};

export const HebDropdown = ({className, ...props}: HebDropdownProps) => {
  let classNameString = "heb-dropdown";
  if (className) {
    classNameString += ` ${className}`;
  }
  return <Dropdown className={classNameString} {...props} />;
};