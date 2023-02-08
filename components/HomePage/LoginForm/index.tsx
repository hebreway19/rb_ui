import React, { useState, useCallback } from "react";
import { Col, Row, Spin, Form, message } from "antd";
import Link from "next/link";
import { HebForm, HebInput, HebButton } from "../../HebElements";

import style from "./LoginForm.module.scss";
import {useTranslation} from "next-i18next";
import {useAuth} from "../../../providers/AuthProvider";
import {RoutePath} from "../../../constants";

type ButtonProps = {
  loginButtonLabel: string;
};

const RegisterButton = ({registrationRedirectButtonLabel}: RegisterButtonProps) => {
  const ButtonComponent = ({size}) => (
    <Link href={RoutePath.REGISTRATION()}>
      <HebButton overText={false} block buttonSize={size}>
        {registrationRedirectButtonLabel}
      </HebButton>
    </Link>
  );
  return (
    <>
      <Col xs={24} sm={11} xl={0}>
        <ButtonComponent size="small"/>
      </Col>
      <Col xs={0} xl={11}>
        <ButtonComponent size="middle"/>
      </Col>
    </>
  );
};

type RegisterButtonProps = {
   registrationRedirectButtonLabel: string;
};

const LoginButton = ({loginButtonLabel}: ButtonProps) => {
  const ButtonComponent = ({size}) => (
    <HebButton block htmlType="submit" buttonSize={size} viewType="primary">
      {loginButtonLabel}
    </HebButton>
  );
  return (
    <>
      <Col xs={24} sm={11} xl={0}>
        <ButtonComponent size="small"/>
      </Col>
      <Col xs={0} xl={11}>
        <ButtonComponent size="middle"/>
      </Col>
    </>
  );
}

export const LoginForm = () => {
  const {t} = useTranslation();
  const { signInByUsernameAndPassword } = useAuth();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const emptyFieldsMessage: string = t("pages.auth.login.form.validate.empty_field");
  const forgotPasswordLabel: string = t("pages.auth.login.forgot_password");

  const loginButtonLabel: string = t("pages.auth.login.buttons.submit");
  const redirectButtonLabel: string = t("pages.auth.login.buttons.redirect");

  const onFinishHandle = useCallback( async ({email, password}) => {
    setIsLoading(true);
    try {
      if (password === "" || email === "") {
        await message.warn(emptyFieldsMessage);
      }
      if (email !== "" && password !== "") {
        await signInByUsernameAndPassword(email.toLowerCase(), password);
      }
    } catch (error) {
      console.error(error);
      await message.warn(error.message)
    }
    setIsLoading(false);
  }, [signInByUsernameAndPassword, emptyFieldsMessage]);

  const getFieldNameLabel = useCallback((fieldName: string) => t(`user.form.${fieldName}`), [t]);

  return (
    <Spin className={style.spinner} spinning={isLoading}>
      <HebForm form={form}
               className={style.loginForm}
               onFinish={onFinishHandle} >
        <Row gutter={[0, 16]}>
          <Col xs={24}>
            <HebForm.Item name="email">
              <HebInput cssType="primary" placeholder={getFieldNameLabel("email")} type="email" />
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <Row>
              <Col xs={24}>
                <HebForm.Item name="password">
                  <HebInput.Password cssType="primary" placeholder={getFieldNameLabel("password")} />
                </HebForm.Item>
              </Col>
              <Col xs={24}>
                <Link href={RoutePath.FORGOT_PASSWORD()}>
                  <span className={style.loginForm__forgotPassword}>{forgotPasswordLabel}</span>
                </Link>
              </Col>
            </Row>
          </Col>
          <Col xs={24}>
            <Row justify="space-between" gutter={[0, 16]} >
              <LoginButton loginButtonLabel={loginButtonLabel} />
              <RegisterButton registrationRedirectButtonLabel={redirectButtonLabel} />
            </Row>
          </Col>
        </Row>
      </HebForm>
    </Spin>
  )
}