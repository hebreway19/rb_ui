import { IconProp } from "@fortawesome/fontawesome-svg-core";
import React, { useCallback, useEffect } from "react";
import { Col, Row, Typography } from "antd";
import {ApiEndpoint, Config, RoutePath} from "../../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faApple, faFacebookF, faGoogle, faVk } from "@fortawesome/free-brands-svg-icons";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import {useTranslation} from "next-i18next";

import style from "./social.module.scss";

export const Social = () => {

  const {t} = useTranslation();

  const appPrivacyStatementLinkLabel = t("pages.home.footer.app_privacy_statement.label");

  const authorizeWithApple = useCallback(() => {
    const params = {
      clientId: Config.APPLE_CLIENT_ID,
      redirectURI: ApiEndpoint.AUTH_WITH_APPLE_CALLBACK,
      scope: "name email"
    };
    window["AppleID"].auth.signIn(params);
  }, []);

  useEffect(() => {
    const params = {
      clientId: Config.APPLE_CLIENT_ID,
      redirectURI: ApiEndpoint.AUTH_WITH_APPLE_CALLBACK,
      scope: "name email"
    };
    window["AppleID"].auth.init(params);
  }, []);
  return (
    <div className={style.social}>
      <Row justify="center">
        <Col xs={24} className={style.social__list}>
          <Row justify="space-between">
            <Col xs={6} className={style.social__listItem}>
              <Typography.Link href={ApiEndpoint.AUTH_WITH_FACEBOOK}>
                <span className="fa-layers fa-fw fa-4x">
                  <FontAwesomeIcon color="#75ECF9" icon={faCircle as IconProp}/>
                  <FontAwesomeIcon transform="shrink-7" color="#75ECF9" icon={faFacebookF as IconProp}/>
                </span>
              </Typography.Link>
            </Col>
            <Col xs={6} className={style.social__listItem}>
              <Typography.Link href={ApiEndpoint.AUTH_WITH_GOOGLE}>
                <span className="fa-layers fa-fw fa-4x">
                  <FontAwesomeIcon color="#75ECF9" icon={faCircle as IconProp}/>
                  <FontAwesomeIcon transform="shrink-7" color="#75ECF9" icon={faGoogle as IconProp}/>
                </span>
              </Typography.Link>
            </Col>
            <Col xs={6} className={style.social__listItem}>
              <Typography.Link href={ApiEndpoint.AUTH_WITH_VKONTAKTE}>
                <span className="fa-layers fa-fw fa-4x">
                  <FontAwesomeIcon color="#75ECF9" icon={faCircle as IconProp}/>
                  <FontAwesomeIcon transform="shrink-7" color="#75ECF9" icon={faVk as IconProp}/>
                </span>
              </Typography.Link>
            </Col>
            <Col xs={6} hidden className={style.social__listItem}>
              <Typography.Link onClick={authorizeWithApple}>
                <span className="fa-layers fa-fw fa-4x">
                  <FontAwesomeIcon color="#75ECF9" icon={faCircle as IconProp}/>
                  <FontAwesomeIcon transform="shrink-6 up-1" color="#75ECF9" icon={faApple as IconProp}/>
                </span>
              </Typography.Link>
            </Col>
          </Row>
        </Col>
        <Col>
          <Link href={RoutePath.APP_PRIVACY_STATEMENT()}>
            <span className={style.appPrivacyStatementLink}
                  style={{color: "rgb(117, 236, 249)", cursor: "pointer"}}>
              {appPrivacyStatementLinkLabel}
            </span>
          </Link>
        </Col>
      </Row>
    </div>
  );
};