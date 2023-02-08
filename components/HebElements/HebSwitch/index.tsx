import React, { useCallback, useState } from "react";
import { Col, Row, Switch, SwitchProps } from "antd";

interface HebSwitchProps extends SwitchProps {
  className?: string;
  checkedChildren?: React.ReactNode[] | React.ReactChildren | string;
  unCheckedChildren?: React.ReactNode[] | React.ReactChildren | string;
  defaultValue?: any;

  onChange?(...args): any;
}

export const HebSwitch = ({className, checkedChildren, unCheckedChildren, defaultValue, onChange, ...props}: HebSwitchProps) => {
  const [isChecked, setIsChecked] = useState(defaultValue || false);
  const isVisibleChildren = !(!checkedChildren || !unCheckedChildren);
  let classNameString = "heb-switch";
  if (className) {
    classNameString += ` ${className}`;
  }
  const onChangeHandle = useCallback((value) => {
    setIsChecked(value);
    onChange && onChange(value);
  }, [onChange]);
  return (
    <>
      {isVisibleChildren
       ? <Row className={`heb-switch__container`}>
         <Col>
           <Switch className={classNameString} onChange={onChangeHandle} {...props}/>
         </Col>
         <Col>{isChecked ? checkedChildren : unCheckedChildren}</Col>
       </Row>
       : <Switch className={classNameString} onChange={onChangeHandle} {...props}/>
      }
    </>
  );
};