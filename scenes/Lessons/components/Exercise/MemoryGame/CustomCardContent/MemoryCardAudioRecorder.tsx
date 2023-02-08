import React, {useCallback, useState} from "react";
import {Button, Col, message, Row} from "antd";
import {AudioOutlined, BorderOutlined, DeleteOutlined} from "@ant-design/icons/lib";
import dynamic from "next/dynamic";
import { useFileService } from "../../../../../../services";
import { HebButton, HebTooltip } from "../../../../../../components/HebElements";
import { useTranslation } from "next-i18next";

const PlayAudio = dynamic(async () => import("react-simple-audio-player"), {ssr: false}) as any;
const ReactMic = dynamic(async () => (await import("react-mic"))["ReactMic"], {ssr: false}) as any;

type MemoryCardAudioRecorderProps = {
  onDone(file): void;
}

type RecorderProps = {
  isRecording: boolean;
  isUploaded: boolean;
}

type RecordProps = {
  blob: Blob;
  blobURL: any;
}

export const MemoryCardAudioRecorder = ({onDone}: MemoryCardAudioRecorderProps) => {
  const {t} = useTranslation();
  const filesService = useFileService();
  
  const [recorderState, setRecorderState] = useState<RecorderProps>({ isRecording: false, isUploaded: false });
  const [currentRecord, setCurrentRecord] = useState<RecordProps>({ blob: null, blobURL: null });
  
  const toggleRecording = useCallback(() => {
    setRecorderState(previousRecordState => ({...previousRecordState, isRecording: !previousRecordState.isRecording}));
  }, []);
  const onStopRecordingHandle = useCallback((data) => {
    setCurrentRecord(data);
  }, []);
  const removeCurrentRecord = useCallback(() => {
    setCurrentRecord({ blob: null, blobURL: null });
  }, []);
  const uploadCurrentRecord = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('file', currentRecord.blob, 'record.mp3');
      const response = await filesService.createFile(formData);
      setRecorderState(previousRecordState => ({...previousRecordState, isUploaded: true}));
      onDone(response);
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
  }, [onDone, currentRecord.blob, filesService]);
  
  const recordButtonTooltip: string = recorderState.isRecording ? t("components.audio.recorder.stop_recording.tooltip")
                                                                : t("components.audio.recorder.recording.tooltip");
  const uploadButtonLabel: string = t("components.audio.recorder.upload.label");
  const uploadButtonTooltip: string = t("components.audio.recorder.upload.tooltip");
  const removeCurrentRecordButtonTooltip: string = t("components.audio.recorder.cancel.tooltip");
  
  return (
    <>
      <Row gutter={[8, 8]} justify="center">
        <Col xs={22} hidden={!!currentRecord.blobURL}>
          <Row gutter={[8, 8]} justify="center">
            <Col xs={24}>
              { process.browser && (
                <ReactMic mimeType="audio/mp3"
                          className="memory-card__audio-player"
                          strokeColor={"#4378a8"} backgroundColor={"#E1E1E1"}
                          record={recorderState.isRecording} onStop={onStopRecordingHandle} />
              )}
            </Col>
            <Col xs={8}>
              <HebTooltip title={recordButtonTooltip} placement="top">
                <Button icon={recorderState.isRecording ? <BorderOutlined /> : <AudioOutlined /> }
                        type="primary" size="large" shape="circle" onClick={toggleRecording}
                        style={{backgroundColor: "#737390", border: "1px solid #75ECF9"}}/>
              </HebTooltip>
            </Col>
          </Row>
        </Col>
        <Col xs={22} hidden={!currentRecord.blobURL}>
          <Row>
            <Col xs={24}>
              { process.browser && (
                <PlayAudio url={currentRecord.blobURL} width="40px"
                           simpleMode={true} colorScale={[
                  "#737390",
                  "#737390",
                  "#75ECF9",
                  "#75ECF9",
                  "rgba(115, 115, 144, 0.85)"
                ]}/>
              )}
            </Col>
          </Row>
        </Col>
        <Col xs={22} hidden={!currentRecord.blobURL || recorderState.isUploaded}>
          <Row gutter={8}>
            <Col xs={14}>
              <HebTooltip title={uploadButtonTooltip} placement="top">
                <HebButton onClick={uploadCurrentRecord} buttonSize="over-small" overText={false}
                           block indicatorLine={false}>
                  {uploadButtonLabel}
                </HebButton>
              </HebTooltip>
            </Col>
            <Col xs={10}>
              <HebTooltip title={removeCurrentRecordButtonTooltip} placement="top">
                <HebButton onClick={removeCurrentRecord} buttonSize="over-small" overText={false}
                           block icon={<DeleteOutlined />} indicatorLine={false} />
              </HebTooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  )
}