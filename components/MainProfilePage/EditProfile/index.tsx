import React, { useCallback, useEffect, useState } from "react";
import { Col, Form, message, Row, Select } from "antd";
import { useTranslation } from "next-i18next";
import moment from "moment";
import nl2br from "react-nl2br";

import { useAuth } from "../../../shared/hooks";
import { UlpanService, useUsersService } from "../../../services";
import { MockCountryData, StatusInCountry, UserProfession } from "../../../constants";
import { HebButton, HebDatePicker, HebForm, HebInput, HebSelect } from "../../HebElements";
import { User } from "../../../types";
import { useLanguage } from "../../../providers";

const personalInfoObj = (fieldList, values) => fieldList?.map(field => {
  return {
    userInfoDefinition: {
      name: field.name,
      type: field.type,
      caption: {
        ru: field.caption.ru,
        fr: field.caption.fr,
        en: field.caption.en
      }
    },
    value: Object.values(values)[Object.keys(values).findIndex((element) => {
      return element === field.name;
    })]
  };
});

type EditProfileProps = {
  user: User | undefined;
  updateUser?(...args): any;
  onDone(...args): any;
};
export const EditProfile = ({user, onDone}: EditProfileProps) => {
  const {language} = useLanguage();
  const {refreshToken} = useAuth();
  const usersService = useUsersService();
  const [item, setItem] = useState(null);
  const [changedField, setChangedField] = useState(null);
  const [isVisibleFields, setIsVisibleFields] = useState({
                                                           statusInCountry: user?.country === MockCountryData.IL.letterCode,
                                                           dateOfRepatriation: user?.statusInCountry === StatusInCountry.REPATRIATE
                                                         });

  const {t} = useTranslation();

  const [form] = Form.useForm();

  const loadUlpanData = useCallback(async (id) => {
    try {
      const foundUlpan = await UlpanService.getUlpanById(id);
      setItem(foundUlpan);
    } catch (error) {
      message.warn(error.message);
      console.error(error);
    }
  }, []);
  useEffect(() => {
    user?.ulpan?._id && loadUlpanData(user?.ulpan?._id);
  }, [user?.ulpan?._id]);

  const onFinish = useCallback(async (values) => {
    try {
      const isVisibleStatusInCountry = values?.country === MockCountryData.IL.letterCode;
      const isVisibleRepatriationDate = isVisibleStatusInCountry === true && values?.statusInCountry === StatusInCountry.REPATRIATE;
      await usersService.updateCurrentAuthorizedUser({
                                                       firstname: values?.firstname,
                                                       surname: values?.surname,
                                                       hebrewProficiency: values?.hebrewProficiency,
                                                       nativeLanguage: values?.nativeLanguage,
                                                       birthday: values?.birthday,
                                                       address: values?.address,
                                                       phone: values?.phone,
                                                       country: values?.country,
                                                       passportId: values?.passportId,
                                                       profession: values?.profession,
                                                       statusInCountry: isVisibleStatusInCountry ? values?.statusInCountry
                                                                                                 : null,
                                                       repatriationDate: isVisibleRepatriationDate ? values?.repatriationDate
                                                                                                   : null,
                                                       personalInfo: item?.studentsRequiredFieldsList
                                                                     ? personalInfoObj(item.studentsRequiredFieldsList, values)
                                                                     : null
                                                     });
      await refreshToken();
      onDone && onDone();
      message.success(t("messages.saved"));
    }
    catch (error) {
      message.warn(error.message);
      console.error(error);
    }
  }, [usersService, item?.studentsRequiredFieldsList, onDone, t, refreshToken]);


  const professionSelectOptions = <>
    {
      Object.values(UserProfession)
            .map((value, index) =>
                   (
                     <Select.Option key={index} value={value}>
                       {t(`profession.${value}`)}
                     </Select.Option>
                   )
            )
    }
  </>;

  const countrySelectOptions = <>
    {
      Object.values(MockCountryData)
            .map((element, index) => (
              <Select.Option
                key={element.letterCode}
                value={element.letterCode}
              >
                {t(`${element.name[String(language)]}`)}
              </Select.Option>))
    }
  </>;

  const changeCountrySelector = useCallback(value => {
    setIsVisibleFields(oldState => ({ ...oldState,
      ...{
        statusInCountry: value === MockCountryData.IL.letterCode,
        dateOfRepatriation: value !== MockCountryData.IL.letterCode && isVisibleFields.dateOfRepatriation === true
          ? false
          : oldState.dateOfRepatriation
      }
    }))
  }, [isVisibleFields.dateOfRepatriation, MockCountryData]);

  const statusInCountrySelectHandle = useCallback(value => {
    setIsVisibleFields(oldState => ({  ...oldState,
      ...{ dateOfRepatriation: (isVisibleFields.statusInCountry === true && value === StatusInCountry.REPATRIATE) }
    }));
  }, [isVisibleFields.statusInCountry]);

  const getUserFieldTranslate = useCallback((fieldName) => t(`user.form.${fieldName}`), [t]);
  const registerDescriptionTitle = t("pages.profile.change_fields.show_button.label");

  const submitButtonLabel = t("register_as_ulpan.submit");

  return (
    <>
      <HebForm
        layout="vertical"
        form={form}
        requiredMark={false}
        initialValues={user}
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
            <h2 className="edit-profile__header">{registerDescriptionTitle}</h2>
          </Col>
        </Row>
        <Row gutter={[22, 12]} style={{marginBottom: 24}}>
          <Col xs={24}>
            <HebForm.Item form={form}
                          name="firstname"
                          changedField={changedField}
                          rules={[{required: true}]}
                          label={getUserFieldTranslate("firstname")}>
              <HebInput cssType="primary" placeholder={getUserFieldTranslate("firstname")}/>
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <HebForm.Item
              form={form}
              name="surname"
              changedField={changedField}
              rules={[{required: true}]}
              label={getUserFieldTranslate("surname")}
            >
              <HebInput
                cssType="primary"
                placeholder={getUserFieldTranslate("surname")}
              />
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <HebForm.Item
              name="country"
              form={form}
              changedField={changedField}
              rules={[{ required: true }]}
              label={getUserFieldTranslate("country")}
            >
              <HebSelect
                type="primary"
                onChange={changeCountrySelector}
                placeholder={getUserFieldTranslate("country")}
              >
                {countrySelectOptions}
              </HebSelect>
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <HebForm.Item
              form={form}
              name="address"
              changedField={changedField}
              rules={[{ required: true }]}
              label={getUserFieldTranslate("address")}
            >
              <HebInput
                cssType="primary"
                placeholder={getUserFieldTranslate("address")}
              />
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <HebForm.Item
              form={form}
              name="profession"
              changedField={changedField}
              rules={[{ required: true }]}
              label={getUserFieldTranslate("profession")}
            >
              <HebSelect
                type="primary"
                placeholder={getUserFieldTranslate("profession")}
              >
                {professionSelectOptions}
              </HebSelect>
            </HebForm.Item>
          </Col>
          <Col xs={24} >
            <HebForm.Item
              form={form}
              name="passportId"
              changedField={changedField}
              rules={[{ required: true }]}
              label={getUserFieldTranslate("passportId")}
            >
              <HebInput
                cssType="primary"
                placeholder={getUserFieldTranslate("passportId")}
              />
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <HebForm.Item
              form={form}
              name="nativeLanguage"
              changedField={changedField}
              rules={[{ required: true }]}
              label={getUserFieldTranslate("nativeLanguage")}
            >
              <HebSelect
                type="primary"
                placeholder={getUserFieldTranslate("nativeLanguage")}
              >
                <Select.Option value="english">
                  {t("user.fields.native_language_selector.english")}
                </Select.Option>
                <Select.Option value="russian">
                  {t("user.fields.native_language_selector.russian")}
                </Select.Option>
                <Select.Option value="franch">
                  {t("user.fields.native_language_selector.franch")}
                </Select.Option>
              </HebSelect>
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <HebForm.Item
              form={form}
              name="birthday"
              changedField={changedField}
              rules={[{ required: true }]}
              label={getUserFieldTranslate("birthday")}
            >
              <HebDatePicker
                disabledDate={current => current && current > moment().endOf("day")}
                type="primary"
                style={{width: "100%"}}
                placeholder={getUserFieldTranslate("birthday")}
              />
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <HebForm.Item
              form={form}
              name="hebrewProficiency"
              changedField={changedField}
              rules={[{ required: true }]}
              label={getUserFieldTranslate("hebrewProficiency")}
            >
              <HebSelect
                type="primary"
                placeholder={getUserFieldTranslate("hebrewProficiency")}
              >
                <Select.Option value="upper_intermediate">
                  {t("user.fields.province_selector.upper_intermediate")}
                </Select.Option>
                <Select.Option value="intermediate">
                  {t("user.fields.province_selector.intermediate")}
                </Select.Option>
                <Select.Option value="elementary">
                  {t("user.fields.province_selector.elementary")}
                </Select.Option>
                <Select.Option value="beginner">
                  {t("user.fields.province_selector.beginner")}
                </Select.Option>
              </HebSelect>
            </HebForm.Item>
          </Col>
          <Col xs={24}>
            <HebForm.Item
              form={form}
              name="phone"
              changedField={changedField}
              rules={[{ required: true }]}
              label={getUserFieldTranslate("phone")}
            >
              <HebInput
                cssType="primary"
                placeholder={getUserFieldTranslate("phone")}
              />
            </HebForm.Item>
          </Col>
          <Col xs={24} hidden={ !isVisibleFields.statusInCountry } >
            <HebForm.Item
              form={form}
              name="statusInCountry"
              changedField={changedField}
              rules={[{ required: isVisibleFields.statusInCountry }]}
              label={getUserFieldTranslate("statusInCountry")}
            >
              <HebSelect
                type="primary"
                onChange={statusInCountrySelectHandle}
                placeholder={getUserFieldTranslate("statusInCountry")}
              >
                <Select.Option value="repatriate">
                  {t("user.fields.status_in_country_selector.repatriate")}
                </Select.Option>
                <Select.Option value="citizen">
                  {t("user.fields.status_in_country_selector.citizen")}
                </Select.Option>
                <Select.Option value="tourist">
                  {t("user.fields.status_in_country_selector.tourist")}
                </Select.Option>
              </HebSelect>
            </HebForm.Item>
          </Col>
          <Col xs={24} hidden={ !isVisibleFields.dateOfRepatriation } >
            <HebForm.Item
              form={form}
              name="repatriationDate"
              changedField={changedField}
              rules={[{ required: isVisibleFields.dateOfRepatriation }]}
              label={getUserFieldTranslate("repatriationDate")}
            >
              <HebDatePicker
                type="primary"
                style={{width: "100%"}}
                placeholder={getUserFieldTranslate("repatriationDate")}
              />
            </HebForm.Item>
          </Col>
        </Row>
        <Row justify="center">
          <Col>
            <HebButton
              style={{width: 186}}
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