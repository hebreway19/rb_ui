import React from "react";
import { Button } from "antd";
import classNames from "classnames";
import { ButtonProps } from "antd/lib/button/button";

type HebButtonProps = ButtonProps & React.RefAttributes<HTMLElement> & {
  overText?: boolean;
  indicatorLine?: boolean;
  buttonSize?: "middle" | "small" | "over-small";
  viewType?: "primary" | "primary-v2" | "default" | "secondary" | "text";
};

export const HebButton = ({viewType = "default", buttonSize = "middle", className = "", overText = true, indicatorLine = true, ...props}: HebButtonProps) => {
  const conditionalClassNames = classNames("heb-button",
                                           `heb-button__${viewType}`,
                                           `heb-button-size__${buttonSize}`,
                                           {"without-indicator": !indicatorLine},
                                           {"over-text": overText},
                                           className.split(" "));
  return (<Button className={conditionalClassNames} {...props} />);
};