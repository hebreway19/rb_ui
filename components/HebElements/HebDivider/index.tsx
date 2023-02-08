import React from "react";
import classNames from "classnames";

export type HebDriverProps = {
  children?: React.ReactNode | React.ReactNode[],
  covers?: boolean,
  className?: string
}

export const HebDivider = ({ children, covers = false, className = "" }: HebDriverProps) => {
  const classNameString: string = classNames("heb-divider",
                                             { "heb-divider-covers": covers },
                                             className.split(" "));
  return (
    <div className={classNameString}>
      <span className="heb-divider__content">
        { children && children }
      </span>
    </div>
  );
};
