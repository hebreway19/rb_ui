import { Col, Form, Row, Select } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import nl2br from "react-nl2br";
import moment from "moment";

import { HebButton, HebDatePicker, HebForm, HebInput, HebSelect, HebTooltip, HebTypography } from "../../../components/HebElements";
import { MockCountryData, StatusInCountry, UserProfession, UserRole, UserState } from "../../../constants";
import { UlpanService, useUsersService } from "../../../services";
import { useLanguage } from "../../../providers";
import { useAuth } from "../../../providers/AuthProvider";
import { PersonalInfo, User } from "../../../types";

const personalInfoObj = (fieldList, values): PersonalInfo[] => fieldList?.map(field => {
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
        value: Object.values(values)[Object.keys(values).findIndex((element) => { return element === field.name } )]
    }
});

export const DataEntryForUlpan = ({id}) => {
  const {language} = useLanguage();
  const {updateCurrentAuthorizedUser} = useAuth();
  const usersService = useUsersService();
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [changedField, setChangedField] = useState(null);
  const [isVisibleFields, setIsVisibleFields] = useState({
                                                           statusInCountry: false,
                                                           dateOfRepatriation: false
                                                         });

  const {t} = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    UlpanService.getUlpanById(id).then(data => setItem(data));
  }, [id]);

  useEffect(() => {
    if (changedField !== null) {
      setTimeout(() => setChangedField(null), 3000);
    }
  }, [changedField]);

  const onFinish = useCallback(async (values) => {
    const isVisibleStatusInCountry = values?.country === MockCountryData.IL.letterCode;
    const isVisibleRepatriationDate = isVisibleStatusInCountry === true && values?.statusInCountry === StatusInCountry.REPATRIATE;
    await updateCurrentAuthorizedUser({
                                        firstname: values?.firstname,
                                        surname: values?.surname,
                                        hebrewProficiency: values?.hebrewProficiency,
                                        nativeLanguage: values?.nativeLanguage,
                                        state: UserState.ACTIVE,
                                        role: UserRole.STUDENT,
                                        birthday: values?.birthday,
                                        address: values?.address,
                                        phone: values?.phone,
                                        country: values?.country,
                                        passportId: values?.passportId,
                                        profession: values?.profession,
                                        statusInCountry: isVisibleStatusInCountry
                                                         ? values?.statusInCountry
                                                         : null,
                                        repatriationDate: isVisibleRepatriationDate
                                                          ? values?.repatriationDate
                                                          : null,
                                        personalInfo: item?.studentsRequiredFieldsList
                                                      ? personalInfoObj(item.studentsRequiredFieldsList, values)
                                                      : null,
                                        ulpan: id
                                      } as User);
    router.reload();
  }, [updateCurrentAuthorizedUser, usersService, router, id, item?.studentsRequiredFieldsList]);

  const professionSelectOptions = <>
    {
      Object.values(UserProfession)
            .map((value, index) => <Select.Option key={index} value={value}>{t(`profession.${value}`)}</Select.Option>)
    }
  </>;

  const countrySelectOptions = <>
                                 { Object.values(MockCountryData)
                                         .map((element, index) => <Select.Option
                                                                    key={index}
                                                                    value={element.letterCode}
                                                                  >
                                                                    {t(`${element.name[String(language)]}`)}
                                                                  </Select.Option> )
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

  const contactPhoneLabel = t("register_as_ulpan.inputs.contact_phone");
  const contactEmailLabel = t("register_as_ulpan.inputs.contact_email");
  const contactAddressLabel = t("register_as_ulpan.inputs.address");

  const getUserFieldTranslate = useCallback((fieldName) => t(`user.form.${fieldName}`), [t]);
  const registerDescriptionTitle = t("pages.choose_ulpan.description");

  const submitButtonLabel = t("register_as_ulpan.submit");

  return (
    <>
      <Row style={{marginTop: 29}} className={"register__ulpan-profile"}>
        <Col xs={24}>
          <HebTypography.Title
            level={3}
            style={{color: "#75ECF9"}}
          >{item?.ulpanName}</HebTypography.Title>
        </Col>
      </Row>
      <Row className={`register__ulpan-profile register__ulpan-profile__item w-20`}>
        <Col xs={6}>
          <HebTypography.Text style={{color: "#75ECF9"}}>{contactPhoneLabel}</HebTypography.Text>
        </Col>
        <Col xs={18}>
          <HebTooltip placement="top" title={"aaaa"}>
            {item?.contactPhone}
          </HebTooltip>

        </Col>
      </Row>
      <Row className={`register__ulpan-profile register__ulpan-profile__item w-45`}>
        <Col xs={6}>
          <HebTypography.Text style={{color: "#75ECF9"}}>{contactEmailLabel}</HebTypography.Text>
        </Col>
        <Col xs={18}>
          {item?.contactEmail}
        </Col>
      </Row>
      <Row className={`register__ulpan-profile register__ulpan-profile__item w-100`} style={{marginBottom: 55}}>
        <Col xs={6}>
          <HebTypography.Text style={{color: "#75ECF9"}}>{contactAddressLabel}</HebTypography.Text>
        </Col>
        <Col xs={18}>
          {item?.address}
        </Col>
      </Row>
      <div className={`registration__plate`}>
        <HebForm layout="vertical" form={form} setChangedField={setChangedField} className="custom-form-requires" validateMessages={{
          required: (...args: string[]): any => nl2br(t("validate.with_entity", {entity: t(`user.form.${args[0].replace(/\[\d+\]/g, "")}`)}))
        }} onFinish={onFinish}>
          <Row>
            <Col xs={24} className={`registration__plate__title`}>
              {registerDescriptionTitle}
            </Col>
          </Row>
          <Row gutter={22} style={{marginBottom: 24}}>
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item form={form} name="firstname" changedField={changedField} rules={[{required: true}]}>
                <HebInput placeholder={getUserFieldTranslate("firstname")}/>
              </HebForm.Item>
            </Col>
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item form={form} name="surname" changedField={changedField} rules={[{required: true}]}>
                <HebInput placeholder={getUserFieldTranslate("surname")}/>
              </HebForm.Item>
            </Col>
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item name="country" form={form} changedField={changedField} rules={[{required: true}]}>
                <HebSelect onChange={changeCountrySelector} placeholder={getUserFieldTranslate("country")}>
                  {countrySelectOptions}
                </HebSelect>
              </HebForm.Item>
            </Col>
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item form={form} name="address" changedField={changedField} rules={[{required: true}]}>
                <HebInput placeholder={getUserFieldTranslate("address")}/>
              </HebForm.Item>
            </Col>
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item form={form} name="profession" changedField={changedField} rules={[{required: true}]}>
                <HebSelect type="text" placeholder={getUserFieldTranslate("profession")}>
                  {professionSelectOptions}
                </HebSelect>
              </HebForm.Item>
            </Col>
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item form={form} name="passportId" changedField={changedField} rules={[{required: true}]}>
                <HebInput placeholder={getUserFieldTranslate("passportId")}/>
              </HebForm.Item>
            </Col>
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item form={form} name="nativeLanguage" changedField={changedField} rules={[{required: true}]}>
                <HebSelect type="text" placeholder={getUserFieldTranslate("nativeLanguage")}>
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
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item form={form} name="birthday" changedField={changedField} rules={[{required: true}]}>
                <HebDatePicker disabledDate={current => current && current > moment().endOf("day")}
                               type="text"
                               style={{width: "100%"}}
                               placeholder={getUserFieldTranslate("birthday")}/>
              </HebForm.Item>
            </Col>
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item form={form} name="hebrewProficiency" changedField={changedField} rules={[{required: true}]}>
                <HebSelect type="text" placeholder={getUserFieldTranslate("hebrewProficiency")}>
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
            <Col xs={24} md={12} className={`register__plate__profile__item`}>
              <HebForm.Item form={form} name="phone" changedField={changedField} rules={[{required: true}]}>
                <HebInput placeholder={getUserFieldTranslate("phone")}/>
              </HebForm.Item>
            </Col>
            <Col xs={24} md={12} className={`register__plate__profile__item`} hidden={!isVisibleFields.statusInCountry}>
              <HebForm.Item
                form={form}
                name="statusInCountry"
                changedField={changedField}
                rules={[{required: isVisibleFields.statusInCountry}]}
              >
                <HebSelect
                  type="text"
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
            <Col xs={24} md={12} className={`register__plate__profile__item`} hidden={ !isVisibleFields.dateOfRepatriation } >
              <HebForm.Item
                form={form}
                name="repatriationDate"
                changedField={changedField}
                rules={[{ required: isVisibleFields.dateOfRepatriation }]}
              >
                <HebDatePicker
                  type="text"
                  style={{width: "100%"}}
                  placeholder={getUserFieldTranslate("repatriationDate")}
                />
              </HebForm.Item>
            </Col>
          </Row>
          <Row justify="center">
            <Col>
              <HebButton style={{width: 186}} overText={false} viewType="primary" htmlType="submit">{submitButtonLabel}</HebButton>
            </Col>
          </Row>
        </HebForm>
      </div>
    </>
  );
}