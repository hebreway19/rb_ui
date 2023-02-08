import { Col, Row } from "antd";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { ChangeLanguageComponent } from "../../shared/components";
import { RoutePath } from "../../constants";
import { useAuth } from "../../shared/hooks";
import { HebButton, HebTooltip } from "../../components/HebElements";

const ActivatedEmailPage = () => {

  const router = useRouter();
  const {user} = useAuth();
  const {t} = useTranslation();

  const redirectToLoginPage = useCallback(() => {
    router.push(RoutePath.LOGIN());
  }, [router]);

  useEffect(() => {
    if (user) {
      router.push(RoutePath.PROFILE());
    }
  }, [router, user]);

  const title = t("pages.activated_email.title");
  const description = t("pages.activated_email.description");

  const redirectButtonLabel = t("pages.activated_email.buttons.redirect.label");
  const redirectButtonTooltip = t("pages.activated_email.buttons.redirect.tooltip");

  return (
    <>
      <div style={{position: "absolute", top: ".5rem", right: ".5rem"}}>
        <ChangeLanguageComponent/>
      </div>
      <div style={{margin: "0 auto", maxWidth: "48rem"}}>
        <Row style={{height: "100vh"}}
             align="middle">
          <Col xs={24}>
            <Row>
              <Col xs={24}>
                <img src={process.env.PUBLIC_URL + "/img/email-is-activated.png"}
                     alt=""
                     style={{width: "100%"}}/>
              </Col>
            </Row>
            <Row>
              <Col xs={24} style={{textAlign: "center"}}>
                <h2 style={{color: "#fff"}}>{title}</h2>
                <p style={{color: "#fff"}}>{description}</p>
              </Col>
            </Row>
            <Row gutter={16} justify="center">
              <Col>
                <HebTooltip placement="top"
                            title={redirectButtonTooltip}>
                  <HebButton viewType="primary"
                             buttonSize="over-small"
                             onClick={redirectToLoginPage}>
                    {redirectButtonLabel}
                  </HebButton>
                </HebTooltip>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default ActivatedEmailPage;