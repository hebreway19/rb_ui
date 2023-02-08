import { Col, message, Row } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { CSSProperties, useCallback } from "react";
import { HebButton, HebPopconfirm } from "../../../components/HebElements";
import { useAuth } from "../../../providers/AuthProvider";
import { useUsersService } from "../../../services";
import { User } from "../../../types";

type FromProps = {
  user: User
  setCurrentUser(User): void
}

export const Form = ({ setCurrentUser, user }: FromProps) => {
  const { t } = useTranslation();
  const usersService = useUsersService();
  const { refreshToken } = useAuth();
  const router = useRouter();

  const removeCurrentUser = useCallback(async () => {
    try {
      const result: User = await usersService.removeCurrentUser();
      setCurrentUser(result);
      await refreshToken();
      location.reload();
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
  }, [usersService, setCurrentUser, router, refreshToken]);

  //Translate for socials
  const socialsTitle: string = t("pages.profile.personal_account_settings.socials.title");
  
  // Translate for removing
  const removeTitle: string = t("pages.profile.personal_account_settings.remove_account.title");
  const removeButtonLabel: string = t("pages.profile.personal_account_settings.remove_account.button.label");
  const removeButtonTooltip: string = t("pages.profile.personal_account_settings.remove_account.button.tooltip");
  
  //Popconfirm default translations
  const okPopconfirmButtonLabel: string = t("actions.apply");
  const cancelPopconfirmButtonLabel: string = t("actions.cancel");
  
  //Styles for titles
  const titleStyle: CSSProperties = { fontFamily: "Roboto",
                                      fontWeight: 500,
                                      fontSize: "1.25rem",
                                      verticalAlign: "middle",
                                      margin: 0,
                                      lineHeight: "2.625rem" };

  return (
    <Row gutter={[0, 16]} >
      <Col xs={24}>
        <Row>
          <Col xs={18}>
            <h3 style={titleStyle}>{removeTitle}</h3>
          </Col>
          <Col xs={6}>
            <HebPopconfirm title={removeButtonTooltip} onConfirm={removeCurrentUser}
                           okText={okPopconfirmButtonLabel} cancelText={cancelPopconfirmButtonLabel}>
              <HebButton overText={false} block buttonSize="over-small">{removeButtonLabel}</HebButton>
            </HebPopconfirm>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}