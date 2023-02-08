import { Drawer } from "antd";
import React, { useCallback, useState } from "react";
import { NavigateComponent } from "../../../shared/components";
import { BlueArrowIcon } from "../../../shared/icons";
import { VersionPanel } from "../../VersionPanel";

export const MobileMenu = () => {
  const [menuIsVisible, setMenuIsVisible] = useState(false);

  const showMenu = useCallback(() => setMenuIsVisible(true), []);
  const hideMenu = useCallback(() => setMenuIsVisible(false), []);
  return (
    <React.Fragment>
      <div className="mobile-menu__showButton" onClick={showMenu}>
        <BlueArrowIcon/>
      </div>
      {
        process.browser &&
        <Drawer className="mobile-menu"
                visible={menuIsVisible}
                onClose={hideMenu}
                placement="top"
                closable={false}
                height={window.outerHeight * 0.9}>
          <div className="mobile-menu__container">
            <NavigateComponent mode="vertical" isMobile={true} onDone={hideMenu}/>
            <VersionPanel isTabletOrMobileDevice={true}/>
          </div>
          <div className="mobile-menu__hideButton" onClick={hideMenu}>
            <BlueArrowIcon/>
          </div>
        </Drawer>
      }
    </React.Fragment>
  );
}