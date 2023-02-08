import React from "react";
import { Table, TableProps } from "antd";

export const HebTable = ({className, ...props}: TableProps<any>) => {
  let classNameString = "heb-table";
  if (className) {
    classNameString += ` ${className}`;
  }
  return (<div className={classNameString}><Table {...props} /></div>);
};