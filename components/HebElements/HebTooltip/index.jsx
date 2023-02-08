import React from "react";
import { Tooltip } from "antd";

const ChildrenClassFactory = {
  HebButton: ({type = "default", size = "middle"}) => ` heb-button heb-button__${type} heb-button-size__${size}`,
  HebInput: ({type = "default"}) => `heb-input heb-input-type__${type}`,
  buildClassName: (elementName, props) => {
    const foundFunc = ChildrenClassFactory[elementName];
    if (foundFunc) {
      return foundFunc(props)
    }
    return "";
  }
}

export const HebTooltip = ({...props}) => {
  return (
    <Tooltip
      className={`heb-tooltip ${ChildrenClassFactory.buildClassName(props?.children?.type?.name, props?.children?.props)}`}
      overlayClassName="heb-tooltip__overlay"
      {...props}
    />
  );
}