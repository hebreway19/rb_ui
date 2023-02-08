import React, { DetailedHTMLProps } from "react";
import { Radio } from "antd";

export namespace HebRadio {
  export const Group = ({...props}) => {
    return (<Radio.Group className={`heb-radio heb-radio__group`} {...props} />);
  };

  interface HebRadioButtonProps extends DetailedHTMLProps<any, any> {
    paddingSize?: string;
  }

  export const Button = ({paddingSize, ...props}: HebRadioButtonProps) => {
    let classNameString = "heb-radio heb-radio__button";
    if (paddingSize) {
      classNameString += ` padding-size__${paddingSize}`;
    }
    return (<Radio.Button className={classNameString} {...props} />);
  };
}