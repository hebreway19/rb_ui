import { Button, Col, Row } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";

import { ChangeLanguageComponent } from "../../shared/components";
import { RoutePath } from "../../constants";
import { useAuth } from "../../shared/hooks";

import "./NotFound.css"

export const NotFoundPage = () => {

    const {t} = useTranslation();
    const {user} = useAuth();

    return (
        <Row style={{ minHeight: "100vh"}} align="middle">
            { user 
              ? null
              : <div style={{position: "absolute", top: ".5rem", right: ".5rem"}}>
                    <ChangeLanguageComponent />
                </div>
            }
            
            <Col xs={24} className="not-found_header__container">

                <img className="not-found_header__img" src={ process.env.PUBLIC_URL + "/img/oops.png"} alt="^^"/>
                
                <h3 className="not-found_header__title">{ t("not_found.header") }</h3>

                <span className="not-found_header__sub-title"><Link href={RoutePath.ROOT}><Button type="primary">{t("not_found.go_back")}</Button></Link></span>
            </Col>
          </Row>
    );
}

 NotFoundPage;