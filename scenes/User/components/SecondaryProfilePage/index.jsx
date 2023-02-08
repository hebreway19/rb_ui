import { Button, Col, DatePicker, Divider, Form, Input, Popover, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { LoaderSpiner } from "../../../../shared/components/ui";
import { RoutePath, StatusInCountry, UserRole, UserState } from "../../../../constants";
import { useAuth } from "../../../../shared/hooks";
import { UsersService } from "../../../../services";
import moment from "moment"
import { Option } from "antd/lib/mentions";
import { useRouter } from "next/router";

export const SecondaryProfilePage = () => {

  const router = useRouter();
  const {user, refreshToken} = useAuth();
  
  const {t} = useTranslation();

  const [form] = Form.useForm();
  
  const [dateOfRepatriationIsVisible, setDateOfRepatriationIsVisible] = useState(false);

  const onFinish = async (values) => {
    

    await UsersService.updateCurrentAuthorizedUser({
      firstname: values?.firstname,
      surname: values?.surname,
      country: values?.country,
      hebrewProficiency: values?.hebrewProficiency,
      nativeLanguage: values?.nativeLanguage,
      state: UserState.ACTIVE,
      role: UserRole.STUDENT,
      birthday: values?.birthday,
      profession: values?.profession,
      statusInCountry: values?.statusInCountry,
      address: values?.address,
                                        phone: values?.phone,
                                        repatriationDate: values?.dateOfRepatriationIsVisible
                                                            ? values?.repatriationDate
                                                            : null
    });
    await refreshToken();
    router.push(RoutePath.PROFILE());
  };

  const statusInCountrySelectHandle = () => {
    setDateOfRepatriationIsVisible(form.getFieldValue("statusInCountry") === StatusInCountry.REPATRIATE)
  }
  
  const onFinishFailed = () => {
  console.error("POST IS CRASHED");
  };

  useEffect(() => {
    refreshToken()
  }, [refreshToken])

  return (
          <div>
              <Row gutter={24} type="flex" justify="center">
                  <Col xs={24} lg={14} className="title">
                      <h3 className="title__header">{t("personal_info")}</h3>
                  </Col>
                  <Col span={24}>
                      <Divider />
                  </Col>
              </Row>
              {(user) ? (
                  <Row type="flex" justify="center" style={{marginBottom: "10px"}}>
                      <Col xs={24} lg={14}>
                          <Form
                              form={form}
                              layout="horizontal"
                              size="large"
                              onFinish={onFinish} onFinishFailed={onFinishFailed}
                              labelCol={{xs: 24 }}
                              labelAlign="left" 
                              wrapperCol={{ xs: 24, lg: 24}}
                          >
                              <Form.Item
                                  name="firstname"
                                  label={t("user.fields.firstname")}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("validate.other_field")
                                    }
                                  ]}
                              >
                                  <Input defaultValue={user.firstname} />
                              </Form.Item>

                              <Form.Item
                                  name="surname"
                                  label={t("user.fields.lastname")}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("validate.other_field")
                                    }
                                  ]}
                              >
                                  <Input defaultValue={user.surname} />
                              </Form.Item>

                              <Form.Item
                                  name="statusInCountry"
                                  label={t("user.fields.status_in_country")}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("validate.other_field")
                                    }
                                  ]}
                              >
                                  <Select onChange={statusInCountrySelectHandle}
                                  placeholder={t("user.fields.status_in_country_selector.select")} 
                                  defaultValue={user.hebrewProficiency}>
                                      <Option value="repatriate">
                                          {t("user.fields.status_in_country_selector.repatriate")}
                                      </Option>
                                      <Option value="citizen">
                                          {t("user.fields.status_in_country_selector.citizen")}
                                      </Option>
                                      <Option value="tourist">
                                          {t("user.fields.status_in_country_selector.tourist")}
                                      </Option>
                                  </Select>
                              </Form.Item>

                              {
                                (dateOfRepatriationIsVisible)
                                &&   <Form.Item
                                      name="repatriationDate"
                                      label={t("user.fields.date_of_repatriation")}
                                      rules={[
                                        {
                                          required: dateOfRepatriationIsVisible,
                                          message: t("validate.other_field")
                                        }
                                      ]}
                                    >
                                      <DatePicker style={{width: "100%"}} defaultValue={moment(user?.repatriationDate)} />
                                    </Form.Item>
                              }

                              <Form.Item
                                  name="address"
                                  label={t("user.fields.address")}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("validate.other_field")
                                    }
                                  ]}
                              >
                                  <Input defaultValue={user.address} />
                              </Form.Item>

                              <Form.Item
                                  name="phone"
                                  label={t("user.fields.phone")}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("validate.other_field")
                                    }
                                  ]}
                              >
                                  <Input defaultValue={user.phone} />
                              </Form.Item>

                              <Form.Item
                                  name="profession"
                                  label={t("user.fields.profession")}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("validate.other_field")
                                    }
                                  ]}
                              >
                                  <Input defaultValue={user.profession} />
                              </Form.Item>

                              <Form.Item
                                  name="country"
                                  label={t("user.fields.country")}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("validate.other_field")
                                    }
                                  ]}
                              >
                                  <Input defaultValue={user.country} />
                              </Form.Item>

                              <Form.Item
                                  name="hebrewProficiency"
                                  label={t("user.fields.hebrew_proficiency")}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("validate.other_field")
                                    }
                                  ]}
                              >
                                  <Select placeholder={t("user.fields.province_selector.select")} 
                                  defaultValue={user.hebrewProficiency}>
                                      <Option value="upper_intermediate">
                                          {t("user.fields.province_selector.upper_intermediate")}
                                      </Option>
                                      <Option value="intermediate">
                                          {t("user.fields.province_selector.intermediate")}
                                      </Option>
                                      <Option value="elementary">
                                          {t("user.fields.province_selector.elementary")}
                                      </Option>
                                      <Option value="beginner">
                                          {t("user.fields.province_selector.beginner")}
                                      </Option>
                                  </Select>
                              </Form.Item>

                              <Form.Item
                                  name="nativeLanguage"
                                  label={t("user.fields.native_language")}
                                  rules={[
                                    {
                                      required: true,
                                      message: t("validate.other_field")
                                    }
                                  ]}
                              >
                                  <Select placeholder={t("user.fields.native_language_selector.select")} 
                                  defaultValue={user.hebrewProficiency}>
                                    <Select.Option value="english">
                                        {t("user.fields.native_language_selector.english")}
                                    </Select.Option>
                                    <Select.Option value="russian">
                                        {t("user.fields.native_language_selector.russian")}
                                    </Select.Option>
                                    <Select.Option value="franch">
                                        {t("user.fields.native_language_selector.franch")}
                                    </Select.Option>
                                  </Select>
                              </Form.Item>

                              <Form.Item
                                name="birthday"
                                label={t("user.fields.birth_day")}
                                rules={[
                                  {
                                    required: true,
                                    message: t("validate.other_field")
                                  }
                                ]}
                              >
                                <DatePicker style={{width: "100%"}} defaultValue={moment(user.age)} />
                              </Form.Item>

                              <Form.Item style={{marginBottom: 0, paddingBottom: 0}}>
                                <p style={{marginBottom: 0, paddingBottom: 0}}>{t("validate.star_fields")}</p>
                              </Form.Item>
                              
                              <Form.Item style={{marginTop: 10, textAlign: "end"}}>
                                <Popover placeholder="top" 
                                trigger="hover" content={t("save_btn_personal_info")}>
                                  <Button style={{width: "100%"}} 
                                  type="primary" htmlType="submit">{t("save")}</Button>
                                </Popover>
                              </Form.Item>
                          </Form>
                      </Col>
                  </Row>
              ) : (
                <LoaderSpiner/>
              )}
          </div>
  );
};