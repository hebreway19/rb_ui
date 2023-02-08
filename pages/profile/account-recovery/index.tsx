import { Col, message, Row } from "antd";
import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import { HebButton } from "../../../components/HebElements/HebButton";
import { useAuth } from "../../../providers/AuthProvider";
import { useUsersService } from "../../../services";

const AccountRecoveryPage = () => {
  const { t } = useTranslation();
  const usersService = useUsersService();
  const { refreshToken } = useAuth();
  const router = useRouter();
  
  const recoveryUser = useCallback(async () => {
    try {
      await usersService.recoveryCurrentUser();
      await refreshToken();
      location.reload();
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
  }, [refreshToken, usersService, router]);

  const title: string = t("pages.account_recovery.title");
  const description: string = t("pages.account_recovery.description");
  const buttonLabel: string = t("pages.account_recovery.recovery_button.label")

  return (
    <Row style={{minHeight: "100vh"}} align="middle" justify="center">
      <Col style={{textAlign: "center"}}>
        <h2 style={{color: "#ffffff", textAlign: "center"}}>{title}</h2>
        <p style={{color: "#ffffff", textAlign: "center"}}>{description}</p>
        <HebButton buttonSize="over-small" overText={false} onClick={recoveryUser}>{buttonLabel}</HebButton>
      </Col>
    </Row>
  )
}

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default AccountRecoveryPage;