import { Button, Col, Divider, Form, Input, Popover, Row } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { UserRole, UserState } from "../../../constants";
import { useAuth } from "../../../shared/hooks";
import { UlpanService, useUsersService } from "../../../services";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

const RegistrationAsUlpanPage = () => {
  const {refreshToken} = useAuth();
  const usersService = useUsersService();
  const [form] = Form.useForm();
  const {t} = useTranslation();
  const onFinish = useCallback(async (values) => {
    const ulpan = await UlpanService.createUlpan(values);
    await usersService.updateCurrentAuthorizedUser({
                                                     state: UserState.AWAIT_REVIEW_FOR_ULPAN,
                                                     role: UserRole.ENROLE,
                                                     ulpan: ulpan._id
                                                   });
    await refreshToken();
  }, [refreshToken, usersService]);

  const onFinishFailed = () => {
  };
  return (
    <>
      <Row justify="center">
        <Col xs={24} lg={14}>
          <h3 className="title__header">{t("navs.register_as_ulpan")}</h3>
        </Col>
        <Col xs={24}>
          <Divider/>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} lg={14}>
          <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} size="large">
            <Form.Item name="ulpanName">
              <Input placeholder={t("register_as_ulpan.inputs.ulpan_name")}/>
            </Form.Item>
            <Form.Item name="description_en">
              <Input.TextArea autoSize={{minRows: 5, maxRows: 5}} placeholder={t("register_as_ulpan.inputs.ulpan_description.en")}/>
            </Form.Item>
            <Form.Item name="description_fr">
              <Input.TextArea autoSize={{minRows: 5, maxRows: 5}} placeholder={t("register_as_ulpan.inputs.ulpan_description.fr")}/>
            </Form.Item>
            <Form.Item name="description_ru">
              <Input.TextArea autoSize={{minRows: 5, maxRows: 5}} placeholder={t("register_as_ulpan.inputs.ulpan_description.ru")}/>
            </Form.Item>
            <Form.Item name="contactEmail">
              <Input placeholder={t("register_as_ulpan.inputs.contact_email")}/>
            </Form.Item>
            <Form.Item name="contactPhone">
              <Input placeholder={t("register_as_ulpan.inputs.contact_phone")}/>
            </Form.Item>
            <Form.Item>
              <Popover placement={"top"} trigger="hover" content={t("save_btn_personal_info")}>
                <Button style={{width: "100%"}} type="primary" htmlType="submit">{t("save")}</Button>
              </Popover>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default RegistrationAsUlpanPage;