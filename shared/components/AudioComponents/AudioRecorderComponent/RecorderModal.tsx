import { Typography } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import { AudioRecorderComponent } from "./";
import { HebDrawer } from "../../../../components/HebElements";

export const RecorderModal = ({visible, onClose, onDone}) => {

  const {t} = useTranslation();

  const recorderTitle = t("components.audio.recorder.title");

  return (
    <HebDrawer visible={visible} onClose={onClose} title={
      <Typography.Title level={3}>
        {recorderTitle}
      </Typography.Title>
    }>
      <AudioRecorderComponent onDone={onDone} onClose={onClose}/>
    </HebDrawer>
  );
}