import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Form, FormItemProps, FormProps } from "antd";
import { HebTooltip } from "../HebTooltip";
import { Rule } from "rc-field-form/lib/interface";
import { FormInstance } from "antd/es";
import classNames from "classnames";

interface HebFormProps extends FormProps<any> {
  setChangedField?: React.Dispatch<React.SetStateAction<any>>;
}

export const HebForm = ({className = "", setChangedField, onFinishFailed = undefined, ...props}: HebFormProps) => {
  const onFailed = useCallback((data) => {
    setChangedField && setChangedField(() => {
      let changedFields = {};
      data.errorFields.forEach((error) => {
        const fieldName: string = Array.isArray(error.name) ? error.name[0] : error.name;
        changedFields[fieldName] = Array.isArray(error.errors) ? error.errors[0][0] : error.errors[0];
      })
      return changedFields;
    });
    onFinishFailed && onFinishFailed(data);
  }, [
                                 onFinishFailed,
                                 setChangedField
                               ]);
  return (
    <Form onValuesChange={setChangedField}
          onFinishFailed={onFailed}
          className={`heb-form ${className}`}
          {...props}/>
  );
};

interface ItemProps extends FormItemProps {
  form?: FormInstance;
  changedField?: string | object;
  type?;
  rules?: Rule[];
  name?: string;
  tooltipOptions?: object;
  tooltipMessage?: string | ReactElement;
  isTooltipValidateMessage?: boolean;
  value?: any;
  title?: string | any;
  dir?: string;
}

export const Item = ({
                       form,
                       changedField,
                       type = "default",
                       className = "",
                       isTooltipValidateMessage = true,
                       tooltipOptions = {},
                       tooltipMessage,
                       ...props
                     }: ItemProps) => {
  const classesString: string = classNames('heb-form__item',
                                           `heb-form__item-${type}`,
                                           className.split(" "));
  return (<Form.Item className={classesString} {...props}/>);
}

HebForm.Item = Item;