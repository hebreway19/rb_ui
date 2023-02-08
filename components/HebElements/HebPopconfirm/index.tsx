import React from "react";
import { Popconfirm } from "antd";
import classNames from "classnames";

import { PopconfirmProps } from "antd/lib/popconfirm";

type HebPopconfirmProps = PopconfirmProps & React.RefAttributes<unknown> & {
  overlayClassName?: string;
};

export const HebPopconfirm = ({className = "", overlayClassName = "", ...props}: HebPopconfirmProps) => {
  const classNameString = classNames("heb-popconfirm",
                                     className.split(" "));
  const overlayClassNameString = classNames("heb-popconfirm-overlay",
                                            overlayClassName.split(" "));
  return <Popconfirm className={classNameString}
                     overlayClassName={overlayClassNameString}
                     {...props} />;
};