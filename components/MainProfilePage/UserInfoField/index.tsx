import React from "react";
import { Col, Row } from "antd";
import moment from "moment";

import { useTranslation } from "next-i18next";

type UserInfoFieldProps = {
  name: string;
  value: any;
  isDate?: boolean;
  children?: React.ReactNode | React.ReactNode[];
}
export const UserInfoField = ({name, value, isDate, children, ...props}: UserInfoFieldProps) => {
  const {t} = useTranslation();
  return (
    <>
      <Row justify="center" className="user-info" gutter={[0, 8]}>
        <Col span={24}>
          <Row justify="start">
            <Col>{name}:&nbsp;</Col>
            <Col flex={1}>{isDate ? moment(value).format(t("date_format")) :value}</Col>
          </Row>
        </Col>
        <Col xs={24} xxl={22}>
          <Row justify="end">
            <Col xs={24} md={20}>
              <div className="user-info__underline"/>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};