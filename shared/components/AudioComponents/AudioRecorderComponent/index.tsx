import { Col, Row, Tabs } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { FileUploadComponent } from "../../FileComponents";
import { Recorder } from "./Recorder";
import { HebTabs } from "../../../../components/HebElements/HebTabs";

type AudioRecorderComponentProps = {
  visible?: boolean;
  onDone(info: any): any;
  onClose?(...args): any;
};
export const AudioRecorderComponent = ({onDone}: AudioRecorderComponentProps) => {
  const {t} = useTranslation();

  const setFile = useCallback((file) => {
    onDone && onDone(file);
  }, [onDone]);

  const recordPanelTitle = t("components.audio.recorder.panels.record_panel.title.label");

  const uploadPanelTitle = t("components.audio.recorder.panels.upload.title.label");

  const RecorderPanel = (
    <Tabs.TabPane tab={recordPanelTitle} key="1">
      <Recorder onDone={onDone}/>
    </Tabs.TabPane>
  );
  const UploadPanel = (
    <Tabs.TabPane tab={uploadPanelTitle} key="2">
      <Row>
        <Col xs={24}>
          <FileUploadComponent accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/m4a,audio/flac,audio/wma,audio/aac" maxCountFileList={1} onDone={setFile}/>
        </Col>
      </Row>
    </Tabs.TabPane>
  );

  return (
    <Row>
      <Col xs={24}>
        <HebTabs accordion>
          {RecorderPanel}
          {UploadPanel}
        </HebTabs>
      </Col>
    </Row>
  );
}

export { RecorderModal } from "./RecorderModal";