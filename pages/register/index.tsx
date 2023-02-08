import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, message, Row, Spin } from "antd";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import parse from "html-react-parser";
import Link from "next/link";
import nl2br from "react-nl2br";

import { HebButton, HebCheckbox, HebForm, HebInput, HebModal, HebTypography } from "../../components/HebElements";
import { LanguageCode, RoutePath, UserState, ValidationRules } from "../../constants";
import { ChangeLanguageAgreement } from "../../shared/components";
import { useAuth } from "../../shared/hooks";
import { useAuthenticationService, UserAgreementService } from "../../services";
import { withSocialLinks } from "../../hocs";
import { ConditionalRedirect } from "../../components/ConditionalRedirect";
import { GetServerSideProps } from "next";

const RegistrationPage = () => {
  const {signInByUsernameAndPassword, user} = useAuth();
  const {t} = useTranslation();
  const authenticationService = useAuthenticationService();

  const haveReadAgreement = (
    <span>
      {t("pages.auth.register.form.inputs.have_read_agreement.i_have_read")}
      <a style={{color: "#75ECF9"}} onClick={(e) => {
        e.preventDefault();
        showModal();
      }}>
        {` ${t("pages.auth.register.form.inputs.have_read_agreement.agreement")}`}
      </a>
    </span>
  );
  const [changedField, setChangedField] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentEnterFields, setCurrentEnterFields] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isValid, setIsValid] = useState({
    email: false,
    password: false,
    confirmPassword: false
  });

  const [form] = Form.useForm()

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lang, setLang] = React.useState(LanguageCode.HE);
  const [agreement, setAgreement] = useState({
    ru: "",
    en: "",
    fr: "",
    he: ""
  });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.setFieldsValue({
      checkbox: true
    })
    setIsModalVisible(false);
    handleFormChange();
  };

  const handleCancel = () => {
    form.setFieldsValue({
      checkbox: false
    })
    setIsModalVisible(false);
    handleFormChange();
  };

  useEffect(() => {
    UserAgreementService.getAgreement().then(res => setAgreement(res)).catch(console.error);
  }, []);


  const onFinish = useCallback(async () => {
    try {
      setIsLoading(true);
      await authenticationService.localRegistration({
                                                      email: form.getFieldValue("email"),
                                                      password: form.getFieldValue("password")
                                                    });
      await signInByUsernameAndPassword(form.getFieldValue("email"), form.getFieldValue("password"));
      setIsLoading(false);
    }
    catch (error) {
      message.error(`${t("incorrect_username_or_password")}`);
      setIsLoading(false);
    }
  }, [authenticationService, form, signInByUsernameAndPassword, t]);

  const handleFormChange = useCallback(() => {
    setCurrentEnterFields({
      email: form.getFieldValue("email"),
      password: form.getFieldValue("password"),
      confirmPassword: form.getFieldValue("confirmPassword")
    });
    setIsValid({
      email: form.getFieldValue("email") !== undefined && (form.getFieldValue("email").length === 0 ||
        !form.getFieldValue("email")
          .match(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)),
      password: form.getFieldValue("password") !== undefined && (form.getFieldValue("password").length === 0 ||
        form.getFieldValue("password")
          .match(/(?=.*[0-9])(?=.*[!:@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!:@#$%^&*]{6,}/g) === null),
      confirmPassword: form.getFieldValue("confirmPassword") !== undefined &&
        (form.getFieldValue("confirmPassword").length === 0 || form.getFieldValue("confirmPassword") !== form.getFieldValue(
          "password"))
    });
    let isDisabled;
    isDisabled = !(form.getFieldValue("email")
      && (form.getFieldValue("checkbox"))
      && (form.getFieldValue("password"))
      && (!form.getFieldError("email").length)
      && (!form.getFieldError("password").length)
      && (!form.getFieldError("confirmPassword").length)
      && (form.getFieldValue("confirmPassword") === form.getFieldValue("password")))
    setIsSubmitDisabled(isDisabled);
  }, [form]);

  const titleLabel = t("pages.auth.register.title");

  const confirmButtonLabel = t("pages.auth.register.buttons.submit");
  const redirectButtonLabel = t("pages.auth.register.buttons.redirect");

  const getUserFieldTranslate = useCallback((fieldName) => t(`user.form.${fieldName}`), [t]);
  const isMobile = useMediaQuery({query: "(max-width: 768px)"});

  return (
    <ConditionalRedirect condition={!!user && user.state === UserState.ACTIVE} successRedirectPath={RoutePath.PROFILE()}>
      <Spin spinning={isLoading}>
        <Row className={`registration-form__title`}>
          <Col xs={24}>
            <HebTypography.Title level={3} style={{textAlign: "center"}}>{titleLabel}</HebTypography.Title>
          </Col>
        </Row>
        <Row className="registration-form-container">
          <HebForm
            layout="vertical"
            form={form}
            onChange={handleFormChange}
            setChangedField={setChangedField}
            className="custom-form-requires"
            validateMessages={{
              required: (...args: string[]): any => nl2br(t('validate.with_entity',
                {entity: t(`user.form.${args[0].replace(/\[\d+\]/g, "")}`)}))
            }}
            onFinish={onFinish}
          >
            <Row gutter={[8, {xs: 10, sm: 10, md: 10}]}>
              <Col xs={24}>
                <HebForm.Item form={form}
                              name="email"
                              changedField={changedField}
                              rules={ValidationRules.EMAIL}
                              tooltipMessage={ValidationRules.EMAIL_MESSAGE(t)}
                              tooltipOptions={{placement: "right"}}>
                  <HebInput
                    cssType="primary"
                    placeholder={getUserFieldTranslate("email")}
                  />
                </HebForm.Item>
              </Col>
              <Col xs={24}>
                <HebForm.Item form={form}
                              name="password"
                              changedField={changedField}
                              rules={ValidationRules.PASSWORD}
                              tooltipMessage={ValidationRules.PASSWORD_MESSAGE(t, currentEnterFields.password)}
                              tooltipOptions={{placement: "right"}}>
                  <HebInput.Password cssType="primary" placeholder={getUserFieldTranslate("password")}/>
                </HebForm.Item>
              </Col>
              <Col xs={24}>
                <HebForm.Item
                  form={form}
                  name="confirmPassword"
                  dependencies={["password"]}
                  changedField={changedField}
                  rules={ValidationRules.getConfirmPassword(t)}
                  tooltipMessage={ValidationRules.CONFIRM_PASSWORD_MESSAGE(t, currentEnterFields.confirmPassword, currentEnterFields.password)}
                  tooltipOptions={{placement: "bottom"}}
                >
                  <HebInput.Password cssType="primary"
                                     placeholder={getUserFieldTranslate("confirmPassword")}/>
                </HebForm.Item>
              </Col>
              <Col xs={24}>
                <Form.Item
                  name="checkbox"
                  valuePropName="checked"
                  className={`register-checkbox`}
                  rules={[
                    {
                      required: true,
                      message: t("pages.auth.register.form.validate.agreement")
                    }]}
                >
                  <HebCheckbox>{haveReadAgreement}</HebCheckbox>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[8, {xs: 10, sm: 10, md: 10}]} style={{marginTop: 10}}>
              <Col xs={24}>
                <HebButton block htmlType="submit" disabled={isSubmitDisabled} {...isMobile && {buttonSize: "over-small"}}>
                  {confirmButtonLabel}
                </HebButton>
              </Col>
              <Col xs={24}>
                <Link href={RoutePath.LOGIN()}>
                  <HebButton block viewType="primary" {...isMobile && {buttonSize: "over-small"}}>{redirectButtonLabel}</HebButton>
                </Link>
              </Col>
            </Row>
          </HebForm>
        </Row>
        <HebModal className='modalAcceptAgreement'
                  title={
                    <span style={{fontSize: 14}}>
                      {t("pages.user_agreement.title")}
                    </span>
                  }
                  visible={isModalVisible}
                  okText={t("user.controls.apply")}
                  onCancel={handleCancel}
                  cancelText={t("user.controls.reject")}
                  footer={
                    <Row gutter={[0, 8]}>
                      <Col xs={24}>
                        <Row justify="center">
                          <Col>
                            <ChangeLanguageAgreement key="1" changeLanguage={setLang} language={lang}/>
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={24}>
                        <Row justify="space-between"
                             gutter={8}>
                          <Col>
                            <HebButton key="2"
                                       buttonSize={"over-small"}
                                       overText={false}
                                       onClick={handleCancel}>{t("user.controls.reject")}</HebButton>
                          </Col>
                          <Col>
                            <HebButton key="3"
                                       buttonSize={"over-small"}
                                       overText={false}
                                       onClick={handleOk}>{t("user.controls.apply")}</HebButton>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  }
        >
          <div style={{color: "#fff"}}>{parse((agreement && agreement[lang]) || "")}</div>
        </HebModal>
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

export default withSocialLinks(RegistrationPage);