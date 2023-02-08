import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, message, Row, Spin, Tooltip, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { LockOutlined } from "@ant-design/icons";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Router from "next/router";
import nl2br from "react-nl2br";

import { RoutePath, ValidationRules } from "../../constants";
import { useAuthenticationService } from "../../services";
import { HebButton, HebInput, HebTooltip } from "../../components/HebElements";
import { useAuth } from "../../providers/AuthProvider";

const PasswordRecoveryPage = ({initialRecoverySession}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {t} = useTranslation();
  const {setToken} = useAuth();
  const authenticationService = useAuthenticationService();

  const [form] = Form.useForm();

  const [recoverySession, setRecoverySession] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentEnterFields, setCurrentEnterFields] = useState({
                                                                 password: "",
                                                                 confirmPassword: ""
                                                               });
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isValid, setIsValid] = useState({
                                           password: false,
                                           confirmPassword: false
                                         });

  const sendPassword = useCallback(async () => {
    try {
      setIsLoaded(true);
      let sessionId = recoverySession;
      let password = form.getFieldValue("password");
      const session = await authenticationService.updatePasswordBySessionId(password, sessionId);
      setToken(session.token);
      Router.push(RoutePath.PROFILE());
    }
    catch (error) {
      console.error(error);
      message.warn(error.message);
    }
    finally {
      setIsLoaded(false);
    }
  }, [authenticationService, setToken, form, recoverySession]);

  const handleFormChange = useCallback(() => {
    setCurrentEnterFields({
                            password: form.getFieldValue("password"),
                            confirmPassword: form.getFieldValue("confirmPassword")
                          });
    setIsValid({
                 password: form.getFieldValue("password") !== undefined && (form.getFieldValue("password").length === 0 ||
                                                                            form.getFieldValue("password")
                                                                                .match(/(?=.*[0-9])(?=.*[!:@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!:@#$%^&*]{6,}/g) === null),
                 confirmPassword: form.getFieldValue("confirmPassword") !== undefined &&
                                  (form.getFieldValue("confirmPassword").length === 0 || form.getFieldValue("confirmPassword") !== form.getFieldValue(
                                    "password"))
               });
    let isDisabled;
    isDisabled = !(form.getFieldValue("password")
                   && (!form.getFieldError("password").length)
                   && (!form.getFieldError("confirmPassword").length)
                   && (form.getFieldValue("confirmPassword") === form.getFieldValue("password")))
    setIsSubmitDisabled(isDisabled);
  }, [form]);

  const formTitle = t("pages.recovery_password.title");
  const passwordLabel = t("new password");
  const confirmPasswordLabel = t("confirm new password");

  const sendPasswordButtonLabel = t("actions.send");
  const sendPasswordButtonTooltip = t("tooltips.press_to_action", {action: sendPasswordButtonLabel.toLowerCase()});

  useEffect(() => {
    if (!!initialRecoverySession && initialRecoverySession !== recoverySession) {
      setRecoverySession(initialRecoverySession);
    }
  }, [initialRecoverySession, recoverySession]);

  console.log("render", recoverySession);

  return (
    <Spin spinning={isLoaded}
          style={{minHeight: "100vh"}}>
      <Row style={{minHeight: "100vh"}}
           justify="center"
           align="middle">
        <Col xs={24} sm={24}
             md={12} lg={7}
             xl={6} xxl={4}>
          <div className="form__container">
            <Tooltip placement={process.browser && window.innerWidth < 768 ? "bottom" : "right"}
                     arrowContent={null}
                     visible={isValid.password || isValid.confirmPassword}
                     title={
                       <>
                         {isValid.password && ValidationRules.PASSWORD_MESSAGE(t, currentEnterFields.password,)}
                         {isValid.confirmPassword && ValidationRules.CONFIRM_PASSWORD_MESSAGE(t, currentEnterFields.confirmPassword, currentEnterFields.password)}
                       </>
                     }>
              <Form layout="vertical"
                    form={form}
                    onChange={handleFormChange}
                    onFinish={sendPassword} >
                <Form.Item style={{textAlign: "center"}}>
                  <Typography.Title level={3}>
                    {formTitle.toUpperCase()}
                  </Typography.Title>
                </Form.Item>
                <Form.Item name="password"
                           hasFeedback
                           required={true}
                           rules={ValidationRules.PASSWORD}>
                  <HebInput.Password size="large"
                                     placeholder={passwordLabel}
                                     prefix={<LockOutlined/>}/>
                </Form.Item>
                <Form.Item name="confirmPassword"
                           dependencies={["password"]}
                           hasFeedback
                           rules={ValidationRules.CONFIRM_PASSWORD}>
                  <HebInput.Password size="large"
                                     placeholder={confirmPasswordLabel}
                                     prefix={<LockOutlined/>}/>
                </Form.Item>
                <Form.Item>
                  <HebTooltip placement="top"
                              title={nl2br(sendPasswordButtonTooltip)}>
                    <HebButton block
                               overText={false}
                               buttonSize="over-small"
                               htmlType="submit"
                               disabled={isSubmitDisabled}>
                      {sendPasswordButtonLabel}
                    </HebButton>
                  </HebTooltip>
                </Form.Item>
              </Form>
            </Tooltip>
          </div>
        </Col>
      </Row>
    </Spin>
  );
}

export const getServerSideProps: GetServerSideProps = async ({locale, query}) => {
  let initialRecoverySession = String(query["recovery-session"] || "");
  return {
    props: {
      initialRecoverySession,
      ...(await serverSideTranslations(locale))
    }
  };
};

export default PasswordRecoveryPage;
