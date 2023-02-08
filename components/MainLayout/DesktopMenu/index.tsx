import { Affix, Layout } from "antd";
import React, { useCallback, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { NavigateComponent } from "../../../shared/components";
import { BlueArrowIcon } from "../../../shared/icons";
import { StorageKey } from "../../../constants";
import { VersionPanel } from "../../VersionPanel";

const {Sider} = Layout;

export const DesktopMenu = () => {
  let isMediumScreen = false;
  let isRetina = false;
    isMediumScreen = useMediaQuery({query: "(min-width: 1024px)"});
    isRetina = useMediaQuery({query: "(min-resolution: 2dppx)"});
  const isRetinaPropsDisplayed: boolean = (isMediumScreen && isRetina);
  const [collapsed, setCollapsed] = useState(process.browser && (window.localStorage.getItem(StorageKey.MENU_TOGLE) === "true") || false);

  const onCollapse = useCallback(() => {
    setCollapsed(oldCollapsed => !oldCollapsed);
    process.browser && window.localStorage.setItem(StorageKey.MENU_TOGLE, String(!collapsed));
  }, [collapsed]);

  return (
    <React.Fragment>
      {
        process.browser && <Sider width={isRetinaPropsDisplayed ? 208 : 226}
                                  collapsible
                                  className={`desktop-menu collapsed-${collapsed}`}
                                  collapsed={collapsed}
                                  onCollapse={onCollapse}
                                  trigger={
                                    <div
                                      style={
                                        collapsed ? {transition: "0.3s"}
                                                  : {transform: "rotate(180deg)", marginTop: isRetinaPropsDisplayed ? 2 : -4, transition: "0.3s"}
                                      }
                                    >
                                      <BlueArrowIcon {...(isRetinaPropsDisplayed && ({style: {fontSize: 10}}))}/>
                                    </div>
                                  }>
          <Affix offsetTop={0}>
            <NavigateComponent collapsed={collapsed} mode="inline"/>
            <div style={{position: "fixed", left: ".5rem", bottom: ".5rem"}}>
              <VersionPanel/>
            </div>
          </Affix>
        </Sider>
      }
    </React.Fragment>
  );
};