import React, { useCallback, useState } from "react";
import { AudioOutlined, BorderOutlined, DeleteOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";

import { useFileService } from "../../../../services";
import { HebButton, HebTooltip } from "../../../../components/HebElements";

const PlayAudio = dynamic(async () => import("react-simple-audio-player"), {ssr: false}) as any;
const ReactMic = dynamic(async () => (await import("react-mic"))["ReactMic"], {ssr: false}) as any;


export const Recorder = ({onDone}) => {
  const {t} = useTranslation();

  const fileService = useFileService();
  const [isRecording, setIsRecording] = useState(false);
  const [isUploaded, setUploaded] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({
                                                       blob: null,
                                                       blobURL: null
                                                     });

  const toggleRecording = useCallback(() => {
    setIsRecording(oldState => !oldState);
  }, []);
  const onStop = useCallback(recordedBlob => {
    setCurrentRecord(recordedBlob);
  }, []);
  const delCurrentRecord = useCallback(() => {
    setCurrentRecord({
                       blob: null,
                       blobURL: null
                     });
  }, []);

  const setFile = useCallback((file) => {
    setUploaded(true);
    onDone && onDone(file);
  }, [onDone]);
  const uploadCurrentRecord = useCallback(async () => {
    try {
      const formData = new FormData();
      const blob  = currentRecord.blob;
      formData.append("file", blob, "record.mp3");
      setFile(await fileService.createFile(formData));
    }
    catch (error) {
      console.error(error);
    }
  }, [currentRecord.blob, setFile, fileService]);

  const recordButtonTooltip = isRecording
                              ? t("components.audio.recorder.stop_recording.tooltip")
                              : t("components.audio.recorder.recording.tooltip");
  
  const uploadButtonLabel = t("components.audio.recorder.upload.label");
  const uploadButtonTooltip = t("components.audio.recorder.upload.tooltip");

  const delCurrentRecordButtonTooltip = t("components.audio.recorder.cancel.tooltip");

  return (
    <>
      <Row justify="center" style={{marginBottom: "1rem"}}>
        <Col xs={24}>
          <div style={{
            position: "relative",
            left: "calc(50% - 100px)",
            height: 200,
            width: 200,
            borderRadius: "50%",
            border: "3px solid #75ECF9",
            backgroundColor: "#6A6A82",
            overflow: "hidden"
          }}>
            {
              process.browser && <ReactMic record={isRecording} onStop={onStop} className="audio-recorder" mimeType="audio/mp3" strokeColor={"#75ECF9"} backgroundColor={"#6A6A82"}/>
            }

          </div>
          <div hidden={!!currentRecord.blobURL}
               style={{
                 position: "absolute",
                 top: "calc(50% - 20px)",
                 left: "calc(50% - 20px)"
               }}>
            <HebTooltip placement="top" hidden={!!currentRecord.blobURL} title={recordButtonTooltip}>
              <Button type="primary" size="large" shape="circle" style={{backgroundColor: "#737390", border: "1px solid #75ECF9"}} disabled={!!currentRecord.blobURL} onClick={toggleRecording}
                      icon={isRecording
                            ? <BorderOutlined/>
                            : <AudioOutlined/>
                      }/>
            </HebTooltip>
          </div>
          <div hidden={!currentRecord.blobURL}
               style={{
                 position: "absolute",
                 top: "calc(50% - 20px)",
                 left: "calc(50% - 20px)"
               }}>
            <HebTooltip placement="top" title={""}>
              {
                process.browser && <PlayAudio url={currentRecord.blobURL} width="40px" simpleMode={true} colorScale={[
                  "#737390",
                  "#737390",
                  "#75ECF9",
                  "#75ECF9",
                  "rgba(115,115,144,0.85)"
                ]}/>
              }
            </HebTooltip>
          </div>
        </Col>
      </Row>
      <Row align="middle" hidden={!currentRecord.blobURL || isUploaded} gutter={8}>
        <Col xs={18}>
          <HebTooltip placement="top" title={uploadButtonTooltip}>
            <HebButton block indicatorLine={false} buttonSize="over-small" disabled={!currentRecord.blobURL} onClick={uploadCurrentRecord} icon={<UploadOutlined/>}>
              {uploadButtonLabel}
            </HebButton>
          </HebTooltip>
        </Col>
        <Col xs={6}>
          <HebTooltip placement="topRight" title={delCurrentRecordButtonTooltip}>
            <HebButton block indicatorLine={false} buttonSize="over-small" disabled={!currentRecord.blobURL} onClick={delCurrentRecord} icon={<DeleteOutlined/>}/>
          </HebTooltip>
        </Col>
      </Row>
    </>
  )
}