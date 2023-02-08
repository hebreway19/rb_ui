import React from "react";
import { Button, Col, Drawer, DrawerProps, Row } from "antd";

import { CloseCircleOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import { FontFamilyProvider } from "../../../providers";
import { useWindowSize } from "../../../shared/hooks";

export type HebDrawerProps = DrawerProps & {
  onClose?: (...args: any) => any;
  children?: React.ReactNode | React.ReactNode[];
}
export const HebDrawer = ({children, onClose, ...props}: HebDrawerProps) => {
  const size = useWindowSize();
  const drawerProps = {onClose, ...props};
  const isDesktopOrLaptop = useMediaQuery({query: "(min-device-width: 768px)"});
  const isBigScreen = useMediaQuery({query: "(min-device-width: 1824px)"});
  const isTabletOrMobile = useMediaQuery({query: "(max-width: 768px)"});
  const isTabletOrMobileDevice = useMediaQuery({query: "(max-device-width: 768px)"});
  const isLandscape = useMediaQuery({query: "(orientation: landscape)"});
  const isHugeScreen = isDesktopOrLaptop || isBigScreen || ((isTabletOrMobile || isTabletOrMobileDevice) && isLandscape);
  const placement = isHugeScreen ? "right" : "top";
  return (
    <Drawer className="heb-drawer" closable={false} width={isHugeScreen ? size.width * 0.4 : size.width} height={isHugeScreen ? size.height : size.height * 0.9} placement={placement} {...drawerProps}>
      <FontFamilyProvider>
        {children}
        <Row hidden={isHugeScreen}
             justify="center"
             style={{marginTop: 62}}>
          <Col>
            <Button type="text" className="lessons-list__drawer__close-drawer" onClick={onClose} icon={<CloseCircleOutlined/>}/>
          </Col>
        </Row>
      </FontFamilyProvider>
    </Drawer>
  );
}