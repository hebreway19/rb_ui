import { Col, Row } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import { ChangeFontComponent, ChangeLanguageComponent } from "../../../../shared/components";
import { HebrewParagraphWithTitle } from "../../../../shared/components/HebrewParagraphWithTitle";
import { HebPageHeader } from "../../../../components/HebElements";
import { useMediaQuery } from "react-responsive";
import "./index.css";

const DesktopMenu = () => {
  const {t} = useTranslation();
  return (
    <Row gutter={[0, 98]}>
      <Col xs={24} className="item-1">
        <Row justify="space-between" align="middle">
          <Col className="page-settings__label__item">
            {t("pages.settings.language")}
          </Col>
          <Col>
            <ChangeLanguageComponent marginRight={49} />
          </Col>
        </Row>
        <hr style={{border: "none", height: 2, width: "100%", background: "#75ECF9"}}/>
      </Col>
      <Col xs={24}>
        <Row justify="space-between" align="middle">
          <Col className="page-settings__label__item">
            {t("pages.settings.hebrew_font_style")}
          </Col>
          <Col style={{width: 286, textAlign: "center"}}>
            <ChangeFontComponent />
          </Col>
        </Row>
        <hr style={{border: "none", height: 2, width: "100%", background: "#75ECF9"}}/>
      </Col>
      <Col xs={24}>
        <Row justify="space-between" align="middle">
          <Col className="page-settings__label__item">
            {t("pages.settings.hebrew_font_size")}
          </Col>
          <hr style={{border: "none", height: 2, width: "100%", background: "#75ECF9"}}/>
          <Col xs={24}>
            <HebrewParagraphWithTitle
              content={
                <div style={{textAlign: "right", color: "#ffffff"}}>
                  עִבְרִית הִיא שָׂפָה שמית, מִמִּשְׁפַּחַת הַשּׂפוֹת האפרו-אסיאתיות, הַיְּדוּעַה כִּשְׂפָתָם שֶׁל הַיְּהוּדִים וְשֶׁל השומרונים
                </div>
              }
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

const MobileMenu = () => {
  const {t} = useTranslation();
  return (
    <Row gutter={[0, 24]}>
      <Col xs={24}>
        <Row justify="center" gutter={[0, 46]}>
          <Col xs={24} style={{textAlign: "center"}} className="label">
            {t("pages.settings.language")}
          </Col>
          <Col>
            <ChangeLanguageComponent marginRight={49} />
          </Col>
        </Row>
      </Col>
      <hr style={{border: "none", height: 2, marginLeft: -8, marginRight: -8, width: "calc(100% + 16px)", background: "#75ECF9"}}/>
      <Col xs={24}>
        <Row justify="center" gutter={[0, 31]}>
          <Col xs={24} style={{textAlign: "center"}} className="label-h17">
            {t("pages.settings.hebrew_font_style")}
          </Col>
          <Col>
            <ChangeFontComponent />
          </Col>
        </Row>
      </Col>
      <hr style={{border: "none", height: 2, marginLeft: -8, marginRight: -8, width: "calc(100% + 16px)", background: "#75ECF9"}}/>
      <Col xs={24}>
        <Row justify="center" gutter={[0, 44]}>
          <Col xs={24} style={{textAlign: "center"}} className="label">
            {t("pages.settings.hebrew_font_size")}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export const UserSettingsPage = () => {
  const {t} = useTranslation();

  const pageTitle = t("navs.settings");


  const isMobile = useMediaQuery({query: "(max-width: 767px)"});

  return (
    <>
      <HebPageHeader
        title={pageTitle}
        borderBottom={true}
      />
      <div style={{padding: isMobile ? 8 : 24}}>
        {isMobile ? <MobileMenu/> : <DesktopMenu/>}
        <div className="footer-img">
        </div>
      </div>
    </>
  );
};