import React, { useState } from "react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { GetStaticProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

import { RoutePath } from "../../../constants";
import { HebButton, HebPageHeader } from "../../../components/HebElements";
import { CardCarousel } from "../../../shared/components/ui";
import { withMainLayout } from "../../../hocs";

const UlpanChoosePage = () => {
  const {t} = useTranslation();
  const [isOneUlpan, setIsOneUlpan] = useState(false);

  return (
    <>
      <HebPageHeader title={isOneUlpan ? t("pages.choose_ulpan.is_one_ulpan") : t("navs.choose_ulpan")}
                     extra={
                       <Link href={RoutePath.REGISTRATION_AS_ULPAN}>
                         <HebButton disabled overText={false}>
                           {t("register_as_ulpan.link_name")}
                         </HebButton>
                       </Link>
                     }/>
      <div style={{
        maxWidth: "964px",
        margin: "0 auto"
      }}>
        <Row justify="center" style={{marginBottom: "10px"}}>
          <Col xs={24} lg={24} style={{height: "auto"}}>
            <CardCarousel setIsOneUlpan={setIsOneUlpan}/>
          </Col>
        </Row>
      </div>
    </>
  );
};

export const getServerSideProps: GetStaticProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(UlpanChoosePage);
