import { Col, Divider, Image, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useAuth } from "../../shared/hooks";
import { Ulpan, User } from "../../types";
import { withMainLayout } from "../../hocs";
import { UlpanService, useUsersService } from "../../services";
import { LoaderSpiner } from "../../shared/components/ui";
import { GetServerSideProps } from "next";

const UlpanControlPage = () => {

  const {t} = useTranslation();
  const {user} = useAuth();
  const usersService = useUsersService();

  const [ulpan, setUlpan] = useState(null);
  const [didLoaded, setDidLoaded] = useState(false);

  const loadUser = useCallback(async () => {
    setDidLoaded(false);
    try {
      const loadedUser: User = await usersService.getUserById(user.userId);
      const loadedUlpan: Ulpan = await UlpanService.getUlpanById(loadedUser.ulpan);
      setUlpan(loadedUlpan);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setDidLoaded(true);
    }
  }, [user, usersService]);

  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, [user, loadUser]);


  return (
    <>
      {/* Header */}
      <Row justify="center">
        <Col xs={24} lg={14}>
          {t("navs.ulpan_control_page")}
        </Col>
      </Row>
      <Divider/>

      {/* Content */}
      {
        didLoaded
        ? (
          <>
            <Row justify="center">
              <Col xs={24} lg={14}>
                <Image/>
              </Col>
            </Row>
          </>
        )
        : <LoaderSpiner/>
      }
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

export default withMainLayout(UlpanControlPage);
