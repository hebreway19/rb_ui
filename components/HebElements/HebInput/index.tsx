import React from "react";
import { Input, InputProps } from "antd";
import classNames from "classnames";
import { PasswordProps } from "antd/es/input";

type HebInputProps = InputProps & {
  cssType?: "default" | "primary" | "circled";
}

export const HebInput = ({cssType = "default", className, ...props}: HebInputProps) => {
  let classNameString = `heb-input heb-input-type__${cssType}`;
  if (className) {
    classNameString += ` ${className}`;
  }
  return (<Input className={classNameString} {...props} />);
};

type HebPasswordProps = PasswordProps & React.RefAttributes<any> & {
  cssType?: "default" | "primary";
}

export const Password = ({cssType = "default", className, ...props}: HebPasswordProps) => {
  let classNameString = `heb-input-password heb-input-password-type__${cssType}`;
  if (className) {
    classNameString += ` ${className}`;
  }
  return (<Input.Password className={classNameString} {...props} />);
};

export const Search = ({cssType = "default", size = "default", className = "", ...props}) => {
  const classNameString = classNames("heb-input-search",
                                     `heb-input-search-type__${cssType}`,
                                     `heb-input-search-size__${size}`,
                                     className.split(" "));
  return (<Input.Search className={classNameString} {...props} />);
};

export const Email = ({cssType = "default", size = "default", className = "", ...props}) => {
  const classNameString = classNames("heb-input-search",
                                     `heb-input-search-type__${cssType}`,
                                     `heb-input-search-size__${size}`,
                                     className.split(" "));
  return (<Input type="email" className={classNameString} {...props} />);
};

HebInput.Password = Password;
HebInput.Search = Search;
HebInput.Email = Email;
