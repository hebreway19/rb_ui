import React, { useEffect, useState } from "react";
import { Col, Row } from "antd";

import packageJson from "../../package.json";
import { useMetadataService } from "../../services";

type VersionType = {
  server: string,
  client?: string,
  model?: string
}

type VersionPanelProps = {
  isTabletOrMobileDevice?: boolean
}

export const VersionPanel = ({isTabletOrMobileDevice = false}: VersionPanelProps) => {
  const metadataService = useMetadataService();
  const [versionState, setVersionState] = useState<VersionType>({server: null, client: null});
  const [didLoaded, setDidLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    const loadInfo = async () => {
      setDidLoaded(false);
      try {
        const loadedVersions: VersionType = await metadataService.getBackendServerVersion();
        loadedVersions.client = packageJson.version;
        setVersionState(loadedVersions);
      } catch (error) {
        console.error(error);
      }
      setDidLoaded(true);
    }
    if (!didLoaded) {
      loadInfo();
    }
  }, []);
  
  return (
    <Row>
      <Col xs={24} hidden={!didLoaded}>
        <span style={{color: "#423e3e", fontSize: ".75rem"}}>
          Client v.-{versionState.client} { !isTabletOrMobileDevice && <br /> }
          Server v.-{versionState.server}
        </span>
      </Col>
    </Row>
  );
}