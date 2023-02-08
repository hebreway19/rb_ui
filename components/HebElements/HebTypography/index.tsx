import React from "react";
import { Typography } from "antd";
import classNames from "classnames";

export namespace HebTypography {
  export const Title = ({className = "", ...props}) => {
    const classNamesString = classNames('heb-typography', className.split(" "));
    return (<Typography.Title className={classNamesString} {...props} />);
  }

  export const Text = ({className = "", ...props}) => {
    const classNamesString = classNames('heb-typography', className.split(" "));
    return (<Typography.Text className={classNamesString} {...props} />);
  }
  export const Paragraph = ({className = "", ...props}) => {
    const classNamesString = classNames('heb-typography', className.split(" "));
    return (<Typography.Paragraph className={classNamesString} {...props} />);
  }
}