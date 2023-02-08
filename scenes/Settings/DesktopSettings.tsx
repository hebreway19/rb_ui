import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { HebrewSizeSelector } from "../../components/HebrewSizeSelector";
import { HebrewStyleSelector } from "../../components/HebrewStyleSelector";
import { LanguageSelector } from "../../components/LanguageSelector";
import { HebrewParagraphWithTitle } from "../../shared/components/HebrewParagraphWithTitle";
import { useMediaQuery } from "react-responsive";

export const DesktopSettings = () => {
  const {t} = useTranslation();
  const isSmallDesktop = useMediaQuery({query: "(min-width: 768px)"});
  
  const languageLabel: string = t("pages.settings.language");
  const hebrewStyleLabel: string = t("pages.settings.hebrew_font_style");
  const hebrewSizeLabel: string = t("pages.settings.hebrew_font_size");
  
  return (
    <Row gutter={[0, 98]}>
      <Col xs={24} className="item-1">
        <Row justify="space-between" align="middle">
          <Col className="page-settings__label__item">
            {languageLabel}
          </Col>
          <Col>
            <LanguageSelector />
          </Col>
        </Row>
        <hr style={{
          border: "none",
          height: 2,
          marginLeft: isSmallDesktop ? 0 : "auto",
          width: isSmallDesktop ? "40%"
            : "100%",
          background: "#75ECF9"}}/>
      </Col>
      <Col xs={24}>
        <Row justify="space-between" align="middle">
          <Col className="page-settings__label__item">
            {hebrewStyleLabel}
          </Col>
          <Col style={{width: 286, textAlign: "center"}}>
            <HebrewStyleSelector />
          </Col>
        </Row>
        <hr style={{
          border: "none",
          height: 2,
          marginLeft: isSmallDesktop ? 0 : "auto",
          width: isSmallDesktop ? "50%"
            : "100%",
          background: "#75ECF9"
        }}/>
      </Col>
      <Col xs={24}>
        <Row justify="space-between" align="middle">
          <Col className="page-settings__label__item">
            {hebrewSizeLabel}
          </Col>
          <Col>
            <HebrewSizeSelector />
          </Col>
        </Row>
        <hr style={{
          border: "none",
          height: 2,
          marginLeft: isSmallDesktop ? 0 : "auto",
          width: isSmallDesktop ? "60%"
            : "100%",
          background: "#75ECF9"
        }}/>
        <Row>
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
  )
}