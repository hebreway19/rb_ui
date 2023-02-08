import React from "react";
import { Col, Row, Divider } from "antd";

import style from "./Layout.module.scss";
import { MobileHeader, Header } from "../Header";
import { LoginForm } from "../LoginForm";
import {Title} from "../Title";
import {LanguageSelector} from "../../LanguageSelector";
import {Footer} from "../Footer";
import {useTranslation} from "next-i18next";

export const HomePageLayout = () => {
  const {t} = useTranslation();

  const quickLoginLabel: string = t("pages.auth.social.divider");

  return (
    <div className={style.container}>
      <div className={style.mobileHeader}>
        <MobileHeader />
      </div>
      <Row justify="space-between">
        <Col>
          <div className={style.header}>
            <Header />
          </div>
        </Col>
        <Col>
          <div className={style.content}>
            <div className={style.desktopContent}>
              <Row>
                <Col xs={24}>
                  <Row justify="end">
                    <Col>
                      <LanguageSelector />
                    </Col>
                  </Row>
                </Col>
                <Col xs={24}>
                  <Title />
                </Col>
              </Row>
            </div>
            <LoginForm />
            <div className={style.socialTitle}>
              <Divider className={style.socialTitle__divider}>
                {quickLoginLabel}
              </Divider>
            </div>
          </div>
        </Col>
        <Col xs={24}>
          <Footer />
        </Col>
      </Row>
    </div>
  )
}