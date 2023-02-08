import React, {useCallback, useState} from "react";
import { Col, Row } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons"
import { HebButton } from "../../../components/HebElements";
import { Form } from "./Form";
import { User } from "../../../types";
import { useTranslation } from "next-i18next";

type PersonalAccountSettingsProps = {
  user: User
  setCurrentUser(User): void
}

export const PersonalAccountSettings = ({ user, setCurrentUser }: PersonalAccountSettingsProps) => {
  const {t} = useTranslation();
  const personalAccountSettingsTitle: string = t('pages.profile.personal_account_settings.title');

  return (
    <Row>
      <Col xs={24}>
        <h2 className="edit-profile__header">{ personalAccountSettingsTitle }</h2>
      </Col>
      <Col xs={24}>
        <Form user={user} setCurrentUser={setCurrentUser} />
      </Col>
    </Row>
  );
}