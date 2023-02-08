import React, { useCallback, useEffect, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useAuth } from "../../providers/AuthProvider";
import { Col, message, Row } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import { User } from "../../types";
import { useUsersService } from "../../services";

import { EditPassword, EditProfile, ProfileAvatar, ProfileHeader, UlpanInfo, UserInfoField } from "../../components/MainProfilePage";
import { HebButton, HebDrawer, HebTooltip } from "../../components/HebElements";
import { withMainLayout } from "../../hocs";
import { GetServerSideProps } from "next";
import {PersonalAccountSettings} from "../../components/MainProfilePage/PersonalAccountSettings";

const ProfilePage = () => {
  const {t} = useTranslation();
  const {user, refreshToken} = useAuth();
  const usersService = useUsersService();
  const [currentUser, setCurrentUser] = useState<User>({} as User);
  const [isVisibleEditFieldsDrawer, setIsVisibleEditFieldsDrawer] = useState(false);
  const [isVisibleEditPasswordDrawer, setIsVisibleEditPasswordDrawer] = useState(false);

  const loadUser = useCallback(async (id) => {
    try {
      const foundUser = await usersService.getUserById(id);
      setCurrentUser(foundUser);
    }
    catch (error) {
      console.error(error);
      message.warn(error.message);
    }
  }, [usersService]);

  const openEditFieldPanel = useCallback(() => {
    setIsVisibleEditFieldsDrawer(true);
  }, []);
  const closeEditFieldPanel = useCallback(() => {
    setIsVisibleEditFieldsDrawer(false);
  }, []);
  const openEditPasswordPanel = useCallback(() => {
    setIsVisibleEditPasswordDrawer(true);
  }, []);
  const closeEditPasswordPanel = useCallback(() => {
    setIsVisibleEditPasswordDrawer(false);
  }, []);

  useEffect(() => {
    user?.userId && loadUser(user.userId);
  }, [user, refreshToken]);

  useEffect(() => {
    refreshToken();
  }, []);

  const getLabelByFieldName = useCallback((fieldName) => t(`user.form.${fieldName}`), [t]);
  const editPasswordTooltip = t("pages.profile.change_pass.show_button.tooltip");

  return (
      <Row className="desktop-layout" align="middle" justify="start">
        <Col xs={24} md={22} className="container">
          <Row justify="center">
            <Col xs={24} md={20}>
              <ProfileHeader state={user?.state}/>
            </Col>
          </Row>
          <Row gutter={[
            0,
            18
          ]} justify="center">
            <Col xs={22} md={23} className="container-info">
              <Row justify="space-between" gutter={[
                0,
                24
              ]}>
                <Col xs={24} md={24} lg={18}>
                  <Row justify="center">
                    <Col xs={21} md={24}>
                      <Row gutter={16} justify="space-between" align="bottom">
                        <Col xs={24} md={10} lg={10}>
                          <Row gutter={[
                            0,
                            24
                          ]} justify="center" style={{textAlign: "center"}}>
                            <Col span={24}>
                              <Row gutter={[
                                0,
                                6
                              ]}>
                                <Col span={24}>
                                  <Row justify="center">
                                    <Col xs={24}>
                                      <h4 className="user-name">
                                        {`${currentUser?.firstname} ${currentUser?.surname}`}
                                      </h4>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col span={24}>
                            <span className="user-country user-field">
                              {`${getLabelByFieldName("country")}: ${currentUser?.country}`}
                            </span>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={24}>
                              <div className="user-avatar">
                                <ProfileAvatar avatarUrl={currentUser?.photoUrl}/>
                              </div>
                            </Col>
                            <Col xs={24}>
                            <span className="user-language user-field">
                              {`${getLabelByFieldName("nativeLanguage")}: ${t("user.fields.native_language_selector." +
                                                                              currentUser?.nativeLanguage)}`}
                            </span>
                            </Col>
                            <Col xs={24}>
                            <span className="user-hebrewProficiency user-field">
                              {`${getLabelByFieldName("hebrewProficiency")}: ${t("user.fields.province_selector." + currentUser?.hebrewProficiency)}`}
                            </span>
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={24} md={14}>
                          <Row gutter={[
                            0,
                            16
                          ]}>
                            <Col xs={24}>
                              <UserInfoField name={getLabelByFieldName("passportId")} value={currentUser?.passportId}/>
                            </Col>
                            <Col xs={24}>
                              <UserInfoField name={getLabelByFieldName("email")} value={currentUser?.email}/>
                            </Col>
                            <Col xs={24}>
                              <UserInfoField name={getLabelByFieldName("phone")} value={currentUser?.phone}/>
                            </Col>
                            <Col xs={24}>
                              <UserInfoField name={getLabelByFieldName("address")} value={currentUser?.address}/>
                            </Col>
                            <Col xs={24}>
                              <UserInfoField name={getLabelByFieldName("profession")} value={t(`profession.${currentUser?.profession}`)}/>
                            </Col>
                            <Col xs={24}>
                              <UserInfoField name={getLabelByFieldName("birthday")} isDate={true} value={currentUser?.birthday}/>
                            </Col>
                            <Col xs={24} hidden={!currentUser?.statusInCountry}>
                              <UserInfoField name={getLabelByFieldName("statusInCountry")}
                                             value={t(`user.fields.status_in_country_selector.${currentUser?.statusInCountry}`)}/>
                            </Col>
                            <Col xs={24} hidden={!currentUser?.repatriationDate}>
                              <UserInfoField name={getLabelByFieldName("repatriationDate")} isDate={true} value={currentUser?.repatriationDate}/>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col xs={24} lg={5}>
                  <Row justify="center">
                    <Col xs={18} md={12} lg={24}>
                      <HebButton block
                                 buttonSize="small"
                                 viewType="secondary"
                                 onClick={openEditFieldPanel}
                      >
                        {t("actions.edit")}
                      </HebButton>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col xs={19}>
              <Row justify="center">
                <Col xs={24} className="ulpan-info">
                  <UlpanInfo ulpan={currentUser?.ulpan}/>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <HebDrawer visible={isVisibleEditFieldsDrawer} onClose={closeEditFieldPanel}>
          <div style={{
            position: "absolute",
            left: 5,
            top: 0
          }}>
            <HebTooltip title={editPasswordTooltip}>
              <HebButton viewType="text" onClick={openEditPasswordPanel}>
                <SettingOutlined/>
              </HebButton>
            </HebTooltip>
          </div>
          <Row gutter={[0, 28]}>
            <Col xs={24}>
              {/*TODO check #updateUser is it used or not*/}
              <EditProfile user={currentUser} updateUser={loadUser} onDone={closeEditFieldPanel}/>
            </Col>
            <Col xs={24}>
              <PersonalAccountSettings user={currentUser} setCurrentUser={setCurrentUser} />
            </Col>
          </Row>
          <HebDrawer visible={isVisibleEditPasswordDrawer} onClose={closeEditPasswordPanel}>
            <EditPassword handleCancel={closeEditPasswordPanel}/>
          </HebDrawer>
        </HebDrawer>
      </Row>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(ProfilePage);