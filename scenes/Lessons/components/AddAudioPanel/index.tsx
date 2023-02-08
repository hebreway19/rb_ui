import React, { useCallback, useState } from "react";
import { FileImageOutlined } from "@ant-design/icons";
import { Space } from "antd";
import { useTranslation } from "next-i18next";

import { File } from "../../../../types";
import { AudioRecorderComponent } from "../../../../shared/components";
import { HebButton, HebDrawer } from "../../../../components/HebElements";

type AddAudioPanelProps = {
  onClose?: (...args: any) => any;
  children?: React.ReactNode | React.ReactNode[];
  onDone?: (file: File) => void | Promise<void>;
}

export const AddAudioPanel = ({onClose, onDone, children = []}: AddAudioPanelProps) => {
  const [audio, setAudio] = useState<File>({} as File);

  const {t} = useTranslation();
  const addAudioTitle = t("actions.add.entity", {entity: t("entities.audio").toLowerCase()});

  const handleSubmit = useCallback(() => onDone(audio), [audio, onDone]);

  return (
    <HebDrawer title={addAudioTitle} placement="right" destroyOnClose={true} closable={false} onClose={onClose} visible={true}>
      <Space direction="vertical" style={{width: "100%"}}>
        {children}
        <AudioRecorderComponent onDone={setAudio}/>
        <HebButton indicatorLine={false} buttonSize="over-small" viewType={!audio._id ? "primary-v2" : "default"} block onClick={handleSubmit} icon={<FileImageOutlined/>} disabled={!audio._id}>
          {addAudioTitle}
        </HebButton>
      </Space>
    </HebDrawer>
  );
};
