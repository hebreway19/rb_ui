import React, { useCallback, useState } from "react";
import { HebForm } from "../../HebElements/";
import { useTranslation } from "next-i18next";
import { Col, Form, message, Row } from "antd";
import nl2br from "react-nl2br";
import { HebButton, HebInput } from "../../HebElements";
import { useUsersService } from "../../../services";
import { useAuth } from "../../../shared/hooks";
import { ValidationRules } from "../../../constants";

export const EditPassword = ({handleCancel}) => {
  const {refreshToken} = useAuth();
  const usersService = useUsersService();
  const [changedField, setChangedField] = useState(null);

  const [submitIsDisable, setSubmitIsDisabled] = useState(true);
  const [currentEnterFields, setCurrentEnterFields] = useState({
                                                                 password: "",
                                                                 confirmPassword: ""
                                                               });
  const {t} = useTranslation();

  const [form] = Form.useForm();

  const onFinish = useCallback(async (values) => {
    try {
      await usersService.updateCurrentUserPassword({password: values.password});
      await refreshToken();
      handleCancel && handleCancel();
      message.success(t("pages.profile.change_pass.messages.success"));
    }
    catch {
      message.warn(t("pages.profile.change_pass.messages.failed"));
    }
  }, [refreshToken, t, handleCancel, usersService]);

  const handleFormChange = useCallback(() => {
    setCurrentEnterFields({
      password: form.getFieldValue("password"),
      confirmPassword: form.getFieldValue("confirmPassword")
    });
    const isDisabled = !(form.getFieldValue("password")
                       && (form.getFieldValue("confirmPassword"))
                       && !(form.getFieldError("password").length)
                       && !(form.getFieldError("confirmPassword").length)
                       && (form.getFieldValue("password") === form.getFieldValue("confirmPassword")));
    setSubmitIsDisabled(isDisabled);
  }, [form]);

  const submitButtonLabel = t("register_as_ulpan.submit");
  const getUserFieldTranslate = useCallback((fieldName) => t(`user.form.${fieldName}`), [t]);
  const editPasswordTitle = t("pages.profile.change_pass.title");

  return (
    <>
      <HebForm
        layout="vertical"
        form={form}
        onChange={handleFormChange}
        setChangedField={setChangedField}
        className="custom-form-requires"
        validateMessages={{
          required: (...args: string[]): any => nl2br(t("validate.with_entity",
                                                        {entity: t(`user.form.${args[0].replace(/\[\d+\]/g, "")}`)}))
        }}
        onFinish={onFinish}
      >
        <Row>
          <Col xs={24}>
            <h2 className="edit-password__header">{editPasswordTitle}</h2>
          </Col>
        </Row>
        <Row gutter={[22, 12]} style={{marginBottom: 24}}>
          <Col xs={24}>
            <HebForm.Item form={form}
                          name="password"
                          changedField={changedField}
                          rules={ValidationRules.PASSWORD}
                          tooltipMessage={ValidationRules.PASSWORD_MESSAGE(t, currentEnterFields.password)}
                          tooltipOptions={{placement: "bottomRight"}}>
              <HebInput.Password cssType="primary" placeholder={getUserFieldTranslate("password")}/>
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <HebForm.Item
              form={form}
              name="confirmPassword"
              changedField={changedField}
              rules={ValidationRules.CONFIRM_PASSWORD}
              tooltipMessage={ValidationRules.CONFIRM_PASSWORD_MESSAGE(t, currentEnterFields.confirmPassword, currentEnterFields.password)}
              tooltipOptions={{placement: "bottomRight"}}
            >
              <HebInput.Password cssType="primary" placeholder={getUserFieldTranslate("confirmPassword")}/>
            </HebForm.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col>
            <HebButton
              style={{width: 186}}
              disabled={submitIsDisable}
              viewType="primary"
              htmlType="submit"
              overText={false}
            >{submitButtonLabel}</HebButton>
          </Col>
        </Row>
      </HebForm>
    </>
  );
}