import React from "react";
import Link from "next/link";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Col, Row } from "antd";
import { HebButton } from "../components/HebElements";
import { RoutePath } from "../constants";
import { useTranslation } from "next-i18next";
import { useAuth } from "../providers/AuthProvider";
import { LanguageSelector } from "../components/LanguageSelector";
import { GetStaticProps } from "next";

export const NotFoundPage = () => {
  const {t} = useTranslation();
  const {user} = useAuth();

  const headerLabel: string = t("not_found.header");
  const redirectButtonLabel: string = t("not_found.go_back");

  return (
    <Row className="not-found_header" align="middle" justify="center">
      {user
       ? null
       : <div style={{position: "absolute", top: ".5rem", right: ".5rem"}}>
         <LanguageSelector/>
       </div>
      }
      <Col xs={23} sm={22} md={24} className="not-found_header__container">
        <img className="not-found_header__img" src={"/img/oops.png"} alt="..."/>
        <h3 className="not-found_header__title">
          {headerLabel}
        </h3>
        <span className="not-found_header__sub-title">
          <Link href={user ? RoutePath.PROFILE() : RoutePath.ROOT}>
            <HebButton viewType="primary" buttonSize="over-small" overText={false}>
              {redirectButtonLabel}
            </HebButton>
          </Link>
        </span>
      </Col>
    </Row>
  );
}

export const getStaticProps: GetStaticProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default NotFoundPage;