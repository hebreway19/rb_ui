import React, { useCallback, useEffect, useState } from "react";
import { Avatar, Button, Col, Divider, Dropdown, Input, Menu, message, Row, Spin, Switch, Tooltip, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { EditOutlined } from "@ant-design/icons";
import moment from "moment";

import { ApiEndpoint, ThirdPartyAuthorizationService, UserRole, UserState } from "../../../../constants";
import { useUsersService } from "../../../../services";
import { AppleIcon, FacebookIcon, GoogleIcon, VkIcon } from "../../../../shared/icons";
import { DescriptionItem } from "../../../../shared/components/ui";
import { User } from "../../../../types";
import { useLanguage } from "../../../../providers";

const socialIcons = {
  [ThirdPartyAuthorizationService.FACEBOOK]: FacebookIcon,
  [ThirdPartyAuthorizationService.VKONTAKTE]: VkIcon,
  [ThirdPartyAuthorizationService.GOOGLE]: GoogleIcon,
  [ThirdPartyAuthorizationService.APPLE]: AppleIcon
};

export const UserDetails = ({
                              userId, callback = () => {
  }
                            }) => {

  const {language} = useLanguage();
  const usersService = useUsersService();
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>();
  const [isActiveState, setIsActiveState] = useState(false);
  const [isShowRejectTextarea, setIsShowRejectTextarea] = useState(false);
  const [rejectTextareaValue, setRejectTextareaValue] = useState("");
  const {Text, Title} = Typography;
  const {t} = useTranslation();

  useEffect(() => {
    if (!currentUser || currentUser._id !== userId) {
      usersService.getUserById(userId)
                  .then((user) => {
                    setCurrentUser(user);
                  });
      setIsShowRejectTextarea(false);
      setRejectTextareaValue("");
    }
  }, [userId, currentUser, usersService]);

  useEffect(() => {
    setIsActiveState(currentUser?.state === UserState.ACTIVE)
  }, [currentUser])

  const upadateUser = useCallback(async (id) => {
    await usersService.getUserById(id)
                      .then((user) => setCurrentUser(user));
    await callback();
  }, [callback, usersService]);

  const updateUserData = useCallback(async (id, newFields) => {
    setIsUpdating(true);
    try {
      await usersService.updateUserStatus(id, {
        id: id,
        ...newFields
      });
      await upadateUser(id);
      message.info(t("info_updat_was_successful"));
    } catch (err) {
      message.warn(t("errors.bad_request") + " " + err.message);
    }
    setIsUpdating(false);
  }, [upadateUser, t, usersService]);

  const changeSwitchHandle = useCallback(async (id ,checked) => {
    let newState = checked ? UserState.ACTIVE : UserState.BANNED;
    await updateUserData(id, { state: newState });
  }, [updateUserData]);
  return  <Spin spinning={!(currentUser?._id)}>
            <Row className="datails__header">
              <Col xs={24}>
                <Title level={3}>
                  {
                    currentUser?.photoUrl
                    ? <Avatar src={`${ApiEndpoint.FILE}/download/${currentUser?.photoUrl}`} />
                    : <Avatar>
                        { currentUser?.email.charAt(0)
                                            .toUpperCase() 
                        }
                      </Avatar>
                  } <Text className="datails__header__title">{ currentUser?.firstname } { currentUser?.surname }</Text>
                </Title>
              </Col>
            </Row>

            <Row>
              <Col xs={24}>
                <Row>
                  <Col xs={24}>
                    <Title level={4}>{t("user.details.personal")}</Title>
                  </Col>
                </Row>
                <Row>
                  <Col  xs={24} 
                        lg={12} >
                          <DescriptionItem  title={t("user.details.full_name")} 
                                            content={<>{currentUser?.firstname} {currentUser?.surname}</>} />
                  </Col>
                  <Col  xs={24} 
                        lg={12} >
                          <DescriptionItem  title={t("user.fields.email")}
                                            content={currentUser?.email} />
                  </Col>
                </Row>
                <Row>
                  <Col  xs={24} 
                        lg={12} >
                          <DescriptionItem  title={t("user.fields.address")} 
                                            content={currentUser?.address} />
                  </Col>
                  <Col  xs={24} 
                        lg={12} >
                          <DescriptionItem  title={t("user.fields.country")}
                                            content={currentUser?.country} />
                  </Col>
                </Row>
                <Row>
                  <Col  xs={24} 
                        lg={12} >
                    <DescriptionItem title={t("user.fields.birth_day")} 
                    content={moment(currentUser?.birthday).format(t("date_format"))} />
                  </Col>
                  <Col  xs={24} 
                        lg={12} >
                          <DescriptionItem  title={t("user.fields.phone")}
                                            content={currentUser?.phone} />
                  </Col>
                </Row>
                <Row>
                  <Col  xs={24} 
                        lg={12} >
                          <DescriptionItem  title={t("user.fields.profession")} 
                                            content={currentUser?.profession} />
                  </Col>
                  <Col xs={24}
                       lg={12}>
                    <DescriptionItem title={t("user.fields.native_language")}
                                     content={(currentUser?.nativeLanguage)
                                              ? t(`user.fields.native_language_selector.${currentUser?.nativeLanguage}`)
                                              : ""}/>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}
                       lg={12}>
                    <DescriptionItem title={t("user.fields.status_in_country")}
                                     content={(currentUser?.statusInCountry)
                                              ? t(`user.fields.status_in_country_selector.${currentUser?.statusInCountry}`)
                                              : ""}/>
                  </Col>
                  <Col xs={24}
                       lg={12}>
                    <DescriptionItem title={t("user.fields.hebrew_proficiency")}
                                     content={(currentUser?.hebrewProficiency)
                                              ? t(`user.fields.province_selector.${currentUser?.hebrewProficiency}`)
                                              : ""
                                     }/>
                  </Col>
                </Row>
                <Row>
                  <Col xs={24}
                       lg={12}>
                    {
                      currentUser?.repatriationDate
                      && <DescriptionItem title={t("user.fields.date_of_repatriation")}
                                          content={moment(currentUser?.repatriationDate).format(t("date_format"))}/>
                    }
                  </Col>
                  <Col xs={24} lg={12}>
                    <DescriptionItem title={t("user.fields.authorization_service")}
                                     content={
                                       currentUser?.authorizationServiceInfo.map((item, index) => {
                                         const IconComponent = socialIcons[item.name];
                                         return (
                                           <Tooltip key={item._id} placement="top" title={t("pages.list_of_users.tooltips.social.enable")}>
                                             <Typography.Link href={item.profilePublicUrl}
                                                              target="_blank">
                                               <IconComponent className={`${item.name}-ico`}/>
                                             </Typography.Link>
                                           </Tooltip>
                                         );
                                       })
                                     }/>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col xs={24}>
                <Row>
                  <Col>
                    <Title level={4}>{t("user.details.ulpan")}</Title>
                  </Col>
                </Row>
                {(currentUser?.personalInfo)
                 && currentUser?.personalInfo.map((field, index) =>
                                                    <Row key={index}>
                                                      <Col xs={24}>
                                                        <DescriptionItem title={
                                                          (field?.userInfoDefinition?.caption?.[String(language)] !== undefined)
                                                          ? field?.userInfoDefinition?.caption?.[String(language)]
                                                          : "— "
                                                        }
                                                                         content={field.value}/>
                                                      </Col>
                                                    </Row>
                )
                }
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col xs={24}>
                <Title level={4}>{t("user.details.control")}</Title>
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={12}>
                <DescriptionItem title={t("user.details.current.state")} 
                content={ <><br />
                            {
                              (currentUser?.state !== UserState.AWAIT_REVIEW_BY_ULPAN && currentUser?.state !== UserState.REJECTED_BY_ULPAN)
                              &&  <Tooltip  placement="top" 
                                            title={t("user.controls.tooltips.change_state")}>
                                              <Switch onChange={ async (checked) => { await changeSwitchHandle(currentUser._id, checked) } }
                                                      disabled={
                                                        currentUser?.state === UserState.AWAIT_EMAIL_CONFIRMATION ||
                                                        currentUser?.state === UserState.ANY ||
                                                        currentUser?.state === UserState.AWAIT_TO_CHOOSE_ULPAN
                                                      }
                                                      checked={isActiveState} 
                                                      loading={isUpdating} />
                                  </Tooltip>
                            } {t(`states.${currentUser?.state}`)}
                          </>
                        }/>
              </Col>
              <Col xs={24} lg={12}>
                <DescriptionItem  title={t("user.details.current.role")}
                                  content={
                                            <><br />
                                              {t(`roles.${currentUser?.role}`)}
                                              {
                                                (currentUser?.state !== UserState.AWAIT_REVIEW_BY_ULPAN && currentUser?.state !== UserState.REJECTED_BY_ULPAN)
                                                &&  <Tooltip placement="top" title={t("user.controls.tooltips.change_role")}>
                                                      <Dropdown
                                                        disabled={currentUser?.state !== UserState.ACTIVE}
                                                        overlay={
                                                        <Menu>
                                                          {
                                                            currentUser?.role !== UserRole.ULPAN_ADMIN
                                                            &&  <Menu.Item  key="setAdminUlpanRole"
                                                                            onClick={ async () => {await updateUserData(currentUser._id, { role: UserRole.ULPAN_ADMIN })}} >
                                                                              {t("roles.ulpan_admin")}
                                                                </Menu.Item>
                                                          }
                                                          {
                                                            currentUser?.role !== UserRole.TEACHER
                                                            &&  <Menu.Item  key="setTeacherRole"
                                                                            onClick={ async () => {await updateUserData(currentUser._id, { role: UserRole.TEACHER })}} >
                                                                              {t("roles.teacher")}
                                                                </Menu.Item>
                                                          }
                                                          {
                                                            currentUser?.role !== UserRole.STUDENT
                                                            &&  <Menu.Item  key="setStudentRole"
                                                                            onClick={ async () => {await updateUserData(currentUser._id, { role: UserRole.STUDENT })}} >
                                                                              {t("roles.student")}
                                                                </Menu.Item>
                                                          }
                                                          {
                                                            currentUser?.role !== UserRole.ENROLE
                                                            &&  <Menu.Item  key="setEnroleeRole"
                                                                            onClick={ async () => {await updateUserData(currentUser._id, { role: UserRole.ENROLE })}} >
                                                                              {t("roles.enrolee")}
                                                                </Menu.Item>
                                                          }
                                                        </Menu>
                                                      } placement="bottomLeft" >
                                                        <Button type="text"><EditOutlined /></Button>
                                                      </Dropdown>
                                                    </Tooltip>
                                              }
                                            </>
                                          } />
              </Col>
            </Row>

            {
              (currentUser?.state === UserState.AWAIT_REVIEW_BY_ULPAN)
              &&  <Row  gutter={6} 
                        style={{marginTop: 14}} >
                          <Col  xs={24} 
                                lg={12} >
                                  <Tooltip  title={t("user.controls.tooltips.accept")} 
                                            placement="top" >
                                              <Button block 
                                                      type="primary"
                                                      onClick={async () => { await updateUserData(currentUser._id, { state: UserState.ACTIVE }) } } >
                                                        {t("user.controls.accept")}
                                              </Button>
                                  </Tooltip>
                          </Col>
                          <Col  xs={24} 
                                lg={12} >
                                  <Tooltip  title={t("user.controls.tooltips.reject")} 
                                            placement="top">
                                              <Button block 
                                                      onClick={async () => { setIsShowRejectTextarea(true) } }>
                                                        {t("user.controls.reject")}
                                              </Button>
                                  </Tooltip>
                          </Col>
                  </Row>
            }

            {
              isShowRejectTextarea
              &&  <Row  gutter={6} 
                        style={{marginTop: 14}} >
                          <Col xs={18}>
                            <Input.TextArea autoSize={{minRows: 3, maxRows: 3}}
                                            onChange={e => {
                                              setRejectTextareaValue(e.target.value);
                                            }} />
                          </Col>
                          <Col xs={6}>
                            <Tooltip  title={t("user.controls.tooltips.apply")} 
                                      placement="top" >
                                        <Button block
                                                style={{height: "100%"}}
                                                onClick={ async () => { 
                                                                        await updateUserData(currentUser._id, {
                                                                                                                state: UserState.AWAIT_REVIEW_BY_ULPAN,
                                                                                                                rejectMessage: rejectTextareaValue 
                                                                                                              })
                                                                      } 
                                                        } >
                                                  {t("user.controls.apply")}        
                                        </Button>
                            </Tooltip>
                          </Col>
                  </Row>
            }
          </Spin>
}