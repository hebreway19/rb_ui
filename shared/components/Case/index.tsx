import React from "react";

export const Case = ({value, isActive = false, ...props}) => {
  return (
    isActive &&
    <React.Fragment>
      {props.children}
    </React.Fragment>
  );
};