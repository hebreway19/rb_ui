import { Button, Col, Form, Row, Spin, Switch, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { DescriptionItem } from "../../../../shared/components/ui";
import { UserRole, UserState } from "../../../../constants";
import { HebSelect } from "../../../../components/HebElements";

export const ControlUser = ({user, callback = () => {}}) => {

  const { t } = useTranslation();

  const [currentUser, setCurrentUser] = useState(null);
  const [isActiveState, setIsActiveState] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    setCurrentUser(user);
    setIsActiveState(currentUser?.state === UserState.ACTIVE);
  }, [user])
  
  const changeStateSwitchHandle = useCallback(() => {
    setIsActiveState(oldIsActive => !oldIsActive);
  }, []);

  const changeRoleSelectHandle = useCallback(async (role) => {
    setNewRole(role);
  }, [])

  const onFinish = useCallback(async (values) => {
    setIsSending(true);
    try {
    } catch {
    }
    setIsSending(false);
  }, []);

  return  <Spin spinning={isSending}>
            <Form
            onFinish={onFinish}>
              <Row>
                <Col xs={24} lg={12}>
                  <Form.Item>
                    <DescriptionItem title={t("user.fields.state")} 
                    content={
                              <>
                                <Switch onChange={changeStateSwitchHandle} defaultChecked={isActiveState}/> 
                                { isActiveState
                                  ? ` ${t(`states.${UserState.ACTIVE}`)}`
                                  : ` ${t(`states.${UserState.BANNED}`)}`
                                }
                              </>
                            }/>
                  </Form.Item>
                </Col>
                <Col xs={24} lg={12}>
                  <Form.Item>
                    <DescriptionItem title={t("user.fields.role")} 
                    content={
                      <HebSelect onChange={async () => changeRoleSelectHandle}>
                        {
                          (currentUser?.role !== UserRole.ULPAN_ADMIN)
                          && <HebSelect.Option value={UserRole.ULPAN_ADMIN} key={UserRole.ULPAN_ADMIN}>{t(`roles.${UserRole.ULPAN_ADMIN}`)}</HebSelect.Option>
                        }
                        {
                          (currentUser?.role !== UserRole.TEACHER)
                          && <HebSelect.Option value={UserRole.TEACHER} key={UserRole.TEACHER}>{t(`roles.${UserRole.TEACHER}`)}</HebSelect.Option>
                        }
                        {
                          (currentUser?.role !== UserRole.STUDENT)
                          && <HebSelect.Option value={UserRole.STUDENT} key={UserRole.STUDENT}>{t(`roles.${UserRole.STUDENT}`)}</HebSelect.Option>
                        }
                        {
                          (currentUser?.role !== UserRole.ENROLE)
                          && <HebSelect.Option value={UserRole.ENROLE} key={UserRole.ENROLE}>{t(`roles.${UserRole.ENROLE}`)}</HebSelect.Option>
                        }
                      </HebSelect>
                    }/>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={6} style={{marginTop: 14}}>
                <Col xs={24}>
                  <Tooltip title={t("user.controls.tooltips.apply")} placement="top">
                    <Button block type="primary"
                    htmlType="submit">
                      {t("user.controls.apply")}</Button>
                  </Tooltip>
                </Col>
              </Row>
            </Form>
          </Spin>
            
          
}