import { Col, Row } from "antd";
import React from "react";
import { AuthWithSosial } from "../../components/AuthWithSosial";
import { ChangeLanguageComponent } from "../../shared/components";

export const withSocialLinks = (WrappedComponent) => {
  const WrappedComponentWithSocialLinks = (actualProps) => (
    <div className="auth-top-padding">
      <div className="language-selector">
        <ChangeLanguageComponent/>
      </div>
      <div className={`auth__wrapper__content`}>
        <Row className="auth__form__container">
          <Col xs={24}>
            <WrappedComponent {...actualProps}/>
          </Col>
        </Row>
        <Row className="auth__social__from">
          <Col xs={24}>
            <AuthWithSosial/>
          </Col>
        </Row>
      </div>
    </div>
  );
  return WrappedComponentWithSocialLinks;
};