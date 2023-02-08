import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { HebPageHeader } from "../../components/HebElements";
import { DesktopSettings, MobileSettings } from "../../scenes/Settings";
import { useMediaQuery } from "react-responsive";
import { withMainLayout } from "../../hocs";
import { GetServerSideProps } from "next";

const Settings = () => {
  const {t} = useTranslation();
  const isMobile = useMediaQuery({query: "(max-width: 767px)"});

  const pageTitle = t("navs.settings");
  return (
    <>
      <HebPageHeader title={pageTitle} borderBottom={true}/>
      <div style={{padding: isMobile ? 8 : 24}}>
        {isMobile ? <MobileSettings /> : <DesktopSettings />}
        <div className="footer-img">
        </div>
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

export default withMainLayout(Settings);