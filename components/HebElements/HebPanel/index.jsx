import React from "react";
import className from "classnames";

export const HebPanel = ({hoverable = false, active = false, children, ...props}) => {
  const classNames = className("heb-panel", "heb-panel__content", {"heb-panel-hoverable": hoverable}, {"heb-panel-active": active});
  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};