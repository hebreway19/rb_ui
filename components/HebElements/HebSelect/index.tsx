import React from "react";
import { Col, Menu, MenuItemProps, Row, Select, SelectProps } from "antd";

import { ArrowIcon } from "../../../shared/icons";
import classNames from "classnames";
import { SizeType } from "antd/lib/config-provider/SizeContext";

type OptionProps = MenuItemProps & {
  value?: any;
}

const Option = ({value, children, ...props}: OptionProps) => {
  return (
    <Menu.Item {...props}>{children}</Menu.Item>
  );
};

type HebSelectProps<T> = (SelectProps<T> | React.HTMLProps<HTMLElement>) & {
  size?: SizeType;
  type?: string;
  arrow?: boolean;
  circular?: boolean;
};

export const HebSelect = ({
                            type = "default",
                            className = "",
                            arrow = true,
                            circular = false,
                            placeholder,
                            ...props
                          }: HebSelectProps<any>) => {
  let placeholderContent = null;
  if (placeholder) {
    placeholderContent = (
      <Row gutter={16.58} align="middle">
        <Col>{placeholder}</Col>
        {arrow && (<Col style={{marginTop: ".3125rem"}}><ArrowIcon/></Col>)}
      </Row>
    );
  }
  const conditionalClassNames = classNames("heb-select",
    `heb-select-type__${type}`,
    {"circular": circular},
    {"without-arrow": !arrow},
    className.split(" "));
  return (<Select className={conditionalClassNames} dropdownClassName={`heb-select__dropdown`} suffixIcon={null}
                  placeholder={placeholderContent} {...props as SelectProps<any>} />);
}

HebSelect.Option = Option;