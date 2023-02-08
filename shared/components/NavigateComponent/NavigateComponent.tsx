import React, { useCallback } from "react";
import { Menu, message } from "antd";
import { useTranslation } from "next-i18next";
import { LogoutOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import Link from "next/link";

import { useAuth } from "../../hooks";
import { withLimitedAccess } from "../../../hocs";
import { HebrewayLogoIcon } from "../../icons/HebrewayLogo";

import { PageInfo, pages } from "./pages";

type NavigateComponentProps = {
  mode?;
  collapsed?: boolean;
  isMobile?: boolean;
  onDone?(...args): any;
};
export const NavigateComponent = ({mode, collapsed = false, isMobile = false, onDone}: NavigateComponentProps) => {
  const router = useRouter();

  const {user, signOut} = useAuth();
  const {t} = useTranslation();
  const isMediumScreen = useMediaQuery({query: "(min-width: 1024px)"});
  const isTabletOrMobileDevice = useMediaQuery({query: "(max-device-width: 767px)"})
  const isRetina = useMediaQuery({query: "(min-resolution: 2dppx)"});
  const isRetinaPropsDisplayed = (isMediumScreen && isRetina);

  const links = pages.map(({path, key, states, roles, icon}) => {
    return withLimitedAccess({
                               roles,
                               path,
                               key,
                               icon,
                               states,
                               disabled: !path,
                               caption: t(`navs.${key}`),
                               children: [<div key={1} onClick={() => onDone && onDone()}><Link href={path || ""}>{t(`navs.${key}`)}</Link></div>]
                             })(Menu.Item);
  });

  const handleLogOutClick = useCallback(async () => {
    await signOut();
    message.warning(t("message_log_out"));
  }, [signOut, t]);

  const matchedPages: PageInfo[] = pages.filter(page => router.pathname.toLowerCase().includes(page?.path?.pathname?.toLowerCase()));
  let currentPage: PageInfo;
  if (matchedPages.length > 1) {
    currentPage = matchedPages.find(page => router.pathname.toLocaleString() === page.path);
  } else {
    currentPage = matchedPages[0];
  }
  return (
    <div className={"heb-menu"}>
      {user &&
        <Menu theme="dark"
                key="menu"
                mode={mode}
                style={!isTabletOrMobileDevice &&
                       !collapsed ? {paddingLeft: 0, maxHeight: "100vh", overflowY: "auto"}
                                  : {maxHeight: "100vh", overflowY: "auto"}}
                selectedKeys={currentPage && [currentPage.key]}
        >
          {!isMobile &&
            <Menu.Item key="logo"
                       style={{
                         height: isRetinaPropsDisplayed ? 49 : 98, paddingTop: 10, textAlign: "center",
                         ...(!collapsed && {
                           padding: "3rem",
                           fontSize: "4.375rem",
                           textAlign: "center"
                         })
                       }}
                       icon={collapsed && <HebrewayLogoIcon/>}>
              {!collapsed && <HebrewayLogoIcon style={{padding: "2rem", fontSize: "4rem"}}/>}
            </Menu.Item>
          }
          {links}
          <Menu.Item key="log_out_btn" icon={<LogoutOutlined/>} onClick={handleLogOutClick}>
            {t("log_out")}
          </Menu.Item>
        </Menu>
      }
    </div>
  );
};