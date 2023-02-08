import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Col, Form, message, Row, Spin } from "antd";
import { useMediaQuery } from "react-responsive";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import nl2br from "react-nl2br";

import { RoutePath, ValidationRules } from "../../constants";
import { useAuth } from "../../shared/hooks";
import { HebButton, HebForm, HebInput, HebTypography } from "../../components/HebElements";
import { withSocialLinks } from "../../hocs";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const LoginPage = ({initialSession}: InferGetServerSidePropsType<typeof getServerSideProps>) => {

  const {signInByUsernameAndPassword, user, signInBySessionId} = useAuth();
  const [form] = Form.useForm();

  const {t} = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const [changedField, setChangedField] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [emailIsValid, setEmailIsValid] = useState(false);

  const handleFormChange = useCallback(() => {
    setEmailIsValid(form.getFieldValue("email") !== undefined && (form.getFieldValue("email").length === 0 ||
                                                                  !form.getFieldValue("email").match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)))
    let isDisabled = true;
    isDisabled = !((form.getFieldValue('email') && !form.getFieldError('email').length) && (form.getFieldValue('password') && !form.getFieldError('password').length))
    setIsSubmitDisabled(isDisabled);
  }, [form]);

  const onFinish = useCallback(async () => {
    try {
      setIsLoading(true);
      const email = form.getFieldValue("email") || "";
      const password = form.getFieldValue("password") || "";
      form.resetFields(["password"]);
      if (password === "" || email === "") {
        message.warn(t("pages.auth.login.form.validate.empty_field"));
      }
      if (email !== "" && password !== "") {
        await signInByUsernameAndPassword(email.toLowerCase(), password);
      }
    }
    catch (error) {
      console.error(error);
      message.warn(error.message);
    }
    setIsLoading(false);
  }, [form, t, signInByUsernameAndPassword]);

  const loginTitle = t("pages.auth.login.title");

  const loginButtonLabel = t("pages.auth.login.buttons.submit");
  const redirectButtonLabel = t("pages.auth.login.buttons.redirect");
  const forgotPasswordLabel = t("pages.auth.login.forgot_password");

  const getUserFieldTranslate = useCallback((fieldName) => t(`user.form.${fieldName}`), [t]);

  const isMobile = useMediaQuery({query: "(max-width: 768px)"});

  useEffect(() => {
    if (initialSession) {
      signInBySessionId(initialSession);
    }
  }, [initialSession]);

  return (
    <>
      <Row className={`login-form__title`}>
        <Col xs={24}>
          <HebTypography.Title level={3} style={{textAlign: "center", color: "#ffffff"}}>
            {loginTitle}
          </HebTypography.Title>
        </Col>
      </Row>
      <Row className="login-form-container">
        <Col xs={24}>
          <Spin spinning={isLoading}>
            <HebForm layout="vertical"
                     form={form}
                     onChange={handleFormChange}
                     setChangedField={setChangedField}
                     className="custom-form-requires"
                     validateMessages={{
                       required: (...args: string[]) => nl2br(t("validate.with_entity", {entity: t(`user.form.${args[0].replace(/\[\d+\]/g, "")}`)})) as any
                     }}
                     onFinish={onFinish}>
              <Row gutter={[8, {xs: 22.86, sm: 22.86, md: 25.86}]}>
                <Col xs={24}>
                  <HebForm.Item form={form}
                                name="email"
                                changedField={changedField}
                                tooltipMessage={ValidationRules.EMAIL_MESSAGE(t)}
                                tooltipOptions={{placement: "right"}}>
                    <HebInput
                      cssType="primary"
                      placeholder={getUserFieldTranslate("email")}
                    />
                  </HebForm.Item>
                </Col>
                <Col xs={24}>
                  <HebForm.Item form={form} name="password" changedField={changedField}>
                    <HebInput.Password cssType="primary" placeholder={getUserFieldTranslate("password")}/>
                  </HebForm.Item>
                </Col>
                <Col xs={24}>
                  <div className="forgot-password-button">
                    <Link href={RoutePath.FORGOT_PASSWORD()}>
                      <span className="custom__default-link"
                            style={{color: "rgb(117, 236, 249)", cursor: "pointer"}}>
                        {forgotPasswordLabel}
                      </span>
                    </Link>
                  </div>
                </Col>
              </Row>
              <Row style={{marginTop: 33}} gutter={[36, {xs: 39, sm: 39, md: 33.86}]}>
                <Col xs={24} md={11}>
                  <HebButton block htmlType="submit" viewType="primary" {...isMobile && {buttonSize: "over-small"}} disabled={isSubmitDisabled}>
                    {loginButtonLabel}
                  </HebButton>
                </Col>
                <Col xs={24} md={13}>
                  <Link href={RoutePath.REGISTRATION()}>
                    <HebButton {...isMobile && {buttonSize: "over-small"}} block>{redirectButtonLabel}</HebButton>
                  </Link>
                </Col>
              </Row>
            </HebForm>
          </Spin>
        </Col>
      </Row>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale, query}) => {
  const initialSession = String(query["session"] || "");
  return {
    props: {
      initialSession,
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withSocialLinks(LoginPage);