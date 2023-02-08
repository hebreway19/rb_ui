import React from "react";
import { Card, CardProps } from "antd";
import classNames from "classnames";

export const HebCard = ({className = "", ...props}: CardProps) => {
  const conditionalClassNames: string = classNames("heb-card",
                                                   className.split(" "));
  return <Card className={conditionalClassNames} {...props} />
}