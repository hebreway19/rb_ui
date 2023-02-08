import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Input } from "antd";
import classNames from "classnames";

interface AutoSizeProps {
  minRows: number
  maxRows: number
}

interface HebTextAreaProps extends React.HTMLProps<HTMLTextAreaElement> {
  autoSize?: AutoSizeProps;
}

export const HebTextArea = ({className = "", ...props}: HebTextAreaProps) => {
  const classNamesString = classNames("heb-textarea",
                                      className.split(" "));
  return (<textarea className={classNamesString} {...props}/>);
};