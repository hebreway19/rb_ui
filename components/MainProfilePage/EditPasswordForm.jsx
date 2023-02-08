import { LockOutlined } from "@material-ui/icons";
import { Button, Form, Input, message, Modal, Tooltip } from "antd";
import React, { useCallback, useState } from "react";
import { useTranslation } from "next-i18next";
import { ValidationRules } from "../../constants";
import { useAuth } from "../../shared/hooks";
import { UsersService } from "../../services";

export const EditPasswordForm = ({
                                  isVisible = false, 
                                  handleOk = () => {},
                                  handleCancel = () => {}
                                }) => {
  const {refreshToken} = useAuth();
  const [form] = Form.useForm();
  const {t} = useTranslation();

  const [submitIsDisable, setSubmitIsDisabled] = useState(true);
  const [currentEnterFields, setCurrentEnterFields] = useState({
                                                                 password: '',
                                                                 confirmPassword: ''
                                                               });
  const [isValid, setIsValid] = useState({
                                           password: false,
                                           confirmPassword: false
                                         });

  const onFinish = useCallback(async (values) => {
    try {
      await UsersService.updateCurrentUserPassword({ password: values.password });
      await refreshToken();
      handleCancel && handleCancel();
      message.success(t("pages.profile.change_pass.messages.success"))
    } catch {
      message.warn(t("pages.profile.change_pass.messages.failed"));
    }
  }, [refreshToken, t, handleCancel]);

  const onFinishFailed = useCallback(() => {
    console.error("POST IS CRASHED");
  }, []);

  const handleFormChange = () => {
    setCurrentEnterFields({
      password: form.getFieldValue("password"),
      confirmPassword: form.getFieldValue("confirmPassword")
    });
    setIsValid({
      password: form.getFieldValue("password") !== undefined && (form.getFieldValue("password").length === 0 || 
                form.getFieldValue("password")
                    .match(/(?=.*[0-9])(?=.*[!:@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!:@#$%^&*]{6,}/g) === null),
      confirmPassword: form.getFieldValue("confirmPassword") !== undefined && 
                      (form.getFieldValue("confirmPassword").length === 0 || form.getFieldValue("confirmPassword") !== form.getFieldValue("password"))
    }); 
    let isDisabled = true;
    isDisabled =  !(form.getFieldValue("password")
                    && (form.getFieldValue("confirmPassword"))
                    && !(form.getFieldError("password").length)
                    && !(form.getFieldError("confirmPassword").length)
                    && (form.getFieldValue("password") === form.getFieldValue("confirmPassword"))
                   );
    setSubmitIsDisabled(isDisabled);
  };

  return  <Modal  
            title={t("pages.profile.change_pass.title")}
            visible={isVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null} 
          >
            <Form
              form={form}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              onChange={handleFormChange}
              labelAlign="left"
              labelCol={{xs: 24}}
              wrapperCol={{xs: 24, lg: 24}}
            >
              <Tooltip visible={isValid.password}
                       placement={window.innerWidth < 768 ? "bottom" : "right"}
                       title={ValidationRules.PASSWORD_MESSAGE(t, currentEnterFields.password)}>
                <Form.Item
                  name="password"
                  label={t("pages.profile.change_pass.fields.password")}
                  rules={ValidationRules.PASSWORD}
                >
                  <Input.Password size="large" prefix={<LockOutlined/>}/>
                </Form.Item>
              </Tooltip>
              <Tooltip visible={isValid.confirmPassword}
                       placement={window.innerWidth < 768 ? "bottom" : "right"}
                       title={ValidationRules.CONFIRM_PASSWORD_MESSAGE(t, currentEnterFields.confirmPassword, currentEnterFields.password)}>
                <Form.Item name="confirmPassword"
                           label={t("pages.profile.change_pass.fields.confirm_password")}
                           rules={ValidationRules.CONFIRM_PASSWORD}
                >
                  <Input.Password size="large" prefix={<LockOutlined/>}/>
                </Form.Item>
              </Tooltip>

              <Form.Item style={{marginBottom: 0, paddingBottom: 0}}>
                <p style={{marginBottom: 0, paddingBottom: 0}}>{t("validate.star_fields")}</p>
              </Form.Item>

              <Form.Item style={{marginBottom: 0, paddingBottom: 0}}>
                <Tooltip  
                  placeholder="top"
                  title={t("pages.profile.change_pass.buttons.tooltips.apply")}
                >
                  <Button 
                    className="main-info__button" 
                    disabled={submitIsDisable} 
                    type="primary" 
                    style={{marginBottom: 0, width: "100%"}}
                    size="large" 
                    htmlType="submit"
                  >
                    {t("pages.profile.change_pass.buttons.apply")}
                  </Button>
                </Tooltip>
              </Form.Item>
            </Form>
          </Modal>
}

 EditPasswordForm;