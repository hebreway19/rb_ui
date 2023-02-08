import React from "react";
import { Modal } from "antd";
import classNames from "classnames";
import { FontFamilyProvider } from "../../../providers";

export const HebModal = ({className = "", children, ...props}) => {
  const classNameString = classNames("heb-modal", className.split(" "));
  return (
    <Modal className={classNameString} {...props}>
      <FontFamilyProvider>
        {children}
      </FontFamilyProvider>
    </Modal>
  )
};