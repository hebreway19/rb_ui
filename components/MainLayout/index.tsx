import React, { useEffect, useState } from "react";
import { BackTop, Col, Layout, Row, Spin } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useAuth } from "../../shared/hooks";
import { MobileMenu } from "./MobileMenu";
import { DesktopMenu } from "./DesktopMenu";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";

const {Content} = Layout;

export const MainLayout = ({children}) => {
  const router = useRouter();
  const {user} = useAuth();

  const [isUpdatingPage, setIsUpdatingPage] = useState<boolean>(true);

  let isTabletOrMobileDevice = false;
  isTabletOrMobileDevice = useMediaQuery({query: "(max-device-width: 767px)"});

  useEffect(() => {
    const handleStart = () => {
      setIsUpdatingPage(true);
    }
    const handleStop = () => {
      setIsUpdatingPage(false);
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleStop)
    router.events.on('routeChangeError', handleStop)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleStop)
      router.events.off('routeChangeError', handleStop)
    }
  }, [router]);

  return (
    <div hidden={!(user && user.userId)} className={"navigate"} style={{maxWidth: "100vw"}}>
      <Layout style={{maxWidth: "100vw"}}>
        { process.browser && user && (isTabletOrMobileDevice ? <MobileMenu/> : <DesktopMenu/>) }
        <Layout>
          <Content className="site-layout-background"
                   style={{
                     minHeight: "100vh",
                     maxWidth: "100vw"
                   }}>
            <Spin spinning={isUpdatingPage} style={{height: "100%", width: "100%"}}>
              {children}
            </Spin>
            <BackTop style={{bottom: 70}} visibilityHeight={-1} onClick={() => router.back()}>
              <Row style={{width: 40, height: 40}} justify="center" align="middle">
                <Col className="go-back__button">
                  <ArrowLeftOutlined/>
                </Col>
              </Row>
            </BackTop>
            <BackTop style={{bottom: 20}}/>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};
