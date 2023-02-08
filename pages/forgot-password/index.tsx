import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, message, Row, Space, Spin, Typography } from "antd";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import nl2br from "react-nl2br";

import { ChangeLanguageComponent } from "../../shared/components";
import { RoutePath, ValidationRules } from "../../constants";
import { useAuthenticationService } from "../../services";
import { HebButton, HebInput, HebTooltip } from "../../components/HebElements";
import { useAuth } from "../../providers/AuthProvider";
import { ConditionalRedirect } from "../../components/ConditionalRedirect";
import { GetServerSideProps } from "next";

const disableTime = 60;

const ForgotPasswordPage = () => {
  const {t} = useTranslation();
  const {user} = useAuth();
  
  const [form] = Form.useForm();

  const authenticationService = useAuthenticationService();
  const [currentEmail, setCurrentEmail] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [messageIsVisible, setMessageIsVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [time, setTime] = useState(disableTime);

  const sendMail = useCallback(async () => {
    try {
      setIsLoaded(true);
      const email = form.getFieldValue("email");
      setCurrentEmail(email);
      await authenticationService.sendPasswordRecoveryInstruction(email);
      setMessageIsVisible(true);
    }
    catch (error) {
      console.error(error);
      message.warn(error.message);
    }
    finally {
      setIsLoaded(false);
    }
  }, [form, authenticationService]);

  const resendClickHandle = useCallback(async () => {
    message.info(t("check_your_mail.alert"));
    setTime(disableTime);
    setIsDisabled(true);
    await sendMail();
  }, [t, sendMail]);

  useEffect(() => {
    setTimeout(() => setTime(time > 0 ? time - 1 : 0), 1000)
  });

  useEffect(() => {
    setIsDisabled(time !== 0)
  }, [time]);

  const formTitle = t("forgot_password.header");
  const emailLabel = t("input.enter_email");
  const sendToEmailButtonLabel = t("actions.send");
  const sendToEmailButtonTooltip = t("tooltips.press_to_action", {action: sendToEmailButtonLabel});

  const checkMailHeader = t("forgot_password.check_mail.header");
  const checkMailSubHeader = t("forgot_password.check_mail.subheader");

  const goBackButtonLabel = t("forgot_password.check_mail.go_back");
  const goBackButtonTooltip = t("tooltips.press_to_action", {action: goBackButtonLabel.toLowerCase()});

  const changeMailButtonLabel = t("forgot_password.check_mail.change_mail");
  const changeMailButtonTooltip = t("tooltips.press_to_action", {action: changeMailButtonLabel.toLowerCase()});

  const resendButtonLabel = t("check_your_mail.resend");
  const resendButtonTooltip = t("tooltips.press_to_action", {action: resendButtonLabel.toLowerCase()});

  return (
    <ConditionalRedirect condition={!!user} successRedirectPath={RoutePath.PROFILE()}>
      <Spin spinning={isLoaded} style={{minHeight: "100vh"}}>
        <Row justify="end">
          <Col style={{margin: ".5rem"}}>
            <ChangeLanguageComponent />
          </Col>
        </Row>
        <Row style={{minHeight: "calc(100vh - 56px"}}
              justify="center"
              align="middle">
          <Col xs={24} sm={24}
               md={12} lg={7}
               xl={6} xxl={4}
               hidden={messageIsVisible}>
            <div className="form__container">
              <Form layout="vertical"
                    form={form}
                    onFinish={sendMail} >
                <Form.Item style={{textAlign: "center"}}>
                  <Typography.Title level={3} style={{color: "#fff"}}>{formTitle.toUpperCase()}</Typography.Title>
                </Form.Item>
                <Form.Item name="email"
                           rules={ValidationRules.EMAIL}>
                  <HebInput cssType="primary"
                            placeholder={emailLabel}
                             />
                </Form.Item>
                <Form.Item>
                  <HebTooltip placement="top"
                           title={nl2br(sendToEmailButtonTooltip)}>
                    <HebButton block
                               viewType="primary"
                               buttonSize="small"
                            htmlType="submit">{sendToEmailButtonLabel}</HebButton>
                  </HebTooltip>
                </Form.Item>
              </Form>
            </div>
          </Col>
          <Col xs={24}
               hidden={!messageIsVisible}>
            <Row style={{width: "64rem", margin: "0 auto"}}>
              <Col xs={24}>
                <Row>
                  <Col xs={24} style={{textAlign: "center"}}>
                    <img src={ process.env.PUBLIC_URL + "/img/check-mail.png"}
                         alt=""
                         style={{width: "100%", maxWidth: "42rem"}}/>
                  </Col>
                </Row>
                <Space direction="vertical" style={{width: "100%"}}>
                  <Row>
                    <Col xs={24} style={{textAlign: "center"}}>
                      <h3 className="check_mail_header__title">
                        {checkMailHeader}
                        <Typography.Link style={{color: "rgba(94, 209, 227, 0.79)"}}
                                          href={`mailto:${currentEmail}`}
                                          target="_blank">
                          { currentEmail }
                        </Typography.Link>
                      </h3>
                      <span style={{color: "#ffffff"}} className="check_mail_header__sub-title">{checkMailSubHeader}</span>
                    </Col>
                  </Row>
                  <Row justify="center"
                      gutter={8}>
                    <Col>
                      <HebTooltip placement="top" title={nl2br(resendButtonTooltip)}>
                        <HebButton viewType="primary" buttonSize="over-small" overText={false} disabled={isDisabled} onClick={resendClickHandle}>
                          <Space>
                            {resendButtonLabel}
                            {isDisabled && `(${time})`}
                          </Space>
                        </HebButton>
                      </HebTooltip>
                    </Col>
                    <Col>
                      <HebTooltip placement="top" title={nl2br(goBackButtonTooltip)}>
                        <Link href={RoutePath.LOGIN()}>
                          <HebButton buttonSize="over-small" overText={false}>{goBackButtonLabel}</HebButton>
                        </Link>
                      </HebTooltip>
                    </Col>
                    <Col>
                      <HebTooltip placement="top"
                               title={nl2br(changeMailButtonTooltip)}>
                        <HebButton onClick={() => setMessageIsVisible(false) }
                                   buttonSize="over-small"
                                   overText={false}>{changeMailButtonLabel}</HebButton>
                      </HebTooltip>
                    </Col>
                  </Row>
                </Space>
              </Col>
            </Row>
          </Col>
        </Row>
      </Spin>
    </ConditionalRedirect>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default ForgotPasswordPage;