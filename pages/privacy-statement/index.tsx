import React from "react";
import { Col, Row } from "antd";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { HebrewayLogoIcon } from "../../shared/icons/HebrewayLogo";
import { LanguageSelector } from "../../components/LanguageSelector";
import { RoutePath } from "../../constants";
import { GetServerSideProps } from "next";

export const PrivacyStatement = () => {
  const {i18n} = useTranslation();
  const rulesPathByLang: string = `/privacy-statement/${i18n.language}.pdf#toolbar=0`;
  return (
    <Row style={{height: "100vh", maxHeight: "100vh"}}>
      <Col xs={24} style={{minHeight: "6rem"}}>
        <Row justify="space-between" align="middle" wrap={false} style={{paddingTop: "1rem", paddingBottom: "1rem"}}>
          <Col offset={1}>
            <Link href={RoutePath.ROOT} locale={i18n.language}>
              <HebrewayLogoIcon />
            </Link>
          </Col>
          <Col style={{paddingRight: "1rem"}}>
            <LanguageSelector />
          </Col>
        </Row>
      </Col>
      <Col xs={24} style={{height: "calc(100% - 6rem)"}}>
        <iframe src={rulesPathByLang} frameBorder="0" width={"100%"} height={"100%"}/>
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

export default PrivacyStatement;