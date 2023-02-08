import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React from "react";
import { HebrewSizeSelector } from "../../components/HebrewSizeSelector";
import { HebrewStyleSelector } from "../../components/HebrewStyleSelector";
import { LanguageSelector } from "../../components/LanguageSelector";
import { HebrewParagraphWithTitle } from "../../shared/components/HebrewParagraphWithTitle";

export const MobileSettings = () => {
  const {t} = useTranslation();
  return (
    <Row gutter={[0, 24]}>
      <Col xs={24}>
        <Row justify="center" gutter={[0, 46]}>
          <Col xs={24} style={{textAlign: "center"}} className="label">
            {t("pages.settings.language")}
          </Col>
          <Col xs={24}>
            <LanguageSelector />
          </Col>
        </Row>
      </Col>
      <hr style={{border: "none", height: 2, marginLeft: -8, marginRight: -8, width: "calc(100% + 16px)", background: "#75ECF9"}}/>
      <Col xs={24}>
        <Row justify="center" gutter={[0, 31]}>
          <Col xs={24} style={{textAlign: "center"}} className="label-h17">
            {t("pages.settings.hebrew_font_style")}
          </Col>
          <Col xs={24}>
            <HebrewStyleSelector />
          </Col>
        </Row>
      </Col>
      <hr style={{border: "none", height: 2, marginLeft: -8, marginRight: -8, width: "calc(100% + 16px)", background: "#75ECF9"}}/>
      <Col xs={24}>
        <Row justify="center" gutter={[0, 44]}>
          <Col xs={24} style={{textAlign: "center"}} className="label">
            {t("pages.settings.hebrew_font_size")}
          </Col>
          <Col xs={24}>
            <HebrewSizeSelector isMobile={true} />
          </Col>
        </Row>
      </Col>
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
  );
}