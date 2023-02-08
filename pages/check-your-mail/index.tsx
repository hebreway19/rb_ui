import React, { useCallback, useEffect, useState } from "react";
import { Col, message, Row, Space, Typography } from "antd";
import { useTranslation } from "next-i18next";

import { ChangeLanguageComponent } from "../../shared/components";
import { useAuth } from "../../shared/hooks";
import { RoutePath } from "../../constants";
import { HebButton } from "../../components/HebElements";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

const disableTime = 60;

export const CheckMailPage = () => {
  const router = useRouter();

  const {resendConfirmationLink, signOut, user} = useAuth();
  const {t} = useTranslation();

  const [isDisabled, setIsDisabled] = useState(true);
  const [time, setTime] = useState(disableTime);

  const resendClickHandle = useCallback(async () => {
    message.info(t("check_your_mail.alert"));
    setTime(disableTime);
    setIsDisabled(true);
    await resendConfirmationLink();
  }, [time, isDisabled, resendConfirmationLink]);

  const logOut = () => {
    if (user) {
      signOut();
    } else {
      router.push(RoutePath.REGISTRATION());
    }
  };

  useEffect(() => {
    setTimeout(() => setTime(time > 0 ? time - 1 : 0), 1000);
  });

  useEffect(() => {
    setIsDisabled(time !== 0);
  }, [time]);

  useEffect(() => {
    if (!user) {
      router.push(RoutePath.REGISTRATION())
    }
  }, [user]);

  return (
    <Row style={{minHeight: "100vh"}} align="middle">
      <div style={{position: "absolute", top: ".5rem", right: ".5rem"}}>
        <ChangeLanguageComponent/>
      </div>

      <Col xs={24} className="check_mail_header__container">
        <img className="check_mail_header__img" src="/img/check-mail.png" alt=""/>
        <h3 style={{color: "#fff"}} className="check_mail_header__title">
          {`${t("pages.check_mail.title")}: `}
          <Typography.Link href="mailto:" style={{color: "rgba(94, 209, 227, 0.79)"}} target="_blank">
            {user?.email}
          </Typography.Link>!
        </h3>
        <span style={{color: "#fff"}} className="check_mail_header__sub-title">
          {t("pages.check_mail.description")}
        </span>
        <br/>
        <br/>
        <span className="check_mail_header__sub-title">
                        <Space>
                          <HebButton viewType="primary" disabled={isDisabled} overText={false} buttonSize="over-small" onClick={resendClickHandle}>
                            {`${t("check_your_mail.resend")} `}
                            {isDisabled && <> ({time})</>}
                          </HebButton>
                          <HebButton onClick={logOut} buttonSize="over-small" overText={false}>{t("check_your_mail.go_back")}</HebButton>
                        </Space>
                      </span>
      </Col>
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

export default CheckMailPage;
