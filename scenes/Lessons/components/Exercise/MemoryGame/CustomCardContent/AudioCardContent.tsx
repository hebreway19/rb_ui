import React, { useState } from "react";
import { Row, Col, Button } from "antd";
import { SimpleAudioComponent } from "../../../../../../shared/components/AudioComponents/SimpleAudioComponent";
import { FileUploadComponent } from "../../../../../../shared/components/FileComponents";
import { MediaContent } from "../../../../../../types";
import { MemoryCardAudioRecorder } from "./MemoryCardAudioRecorder";

export type AudioCardContentProps = {
  cardContent: MediaContent,
  onDone;
}

enum SelectType {
  RECORDER = "recorder",
  UPLOADER = "uploader"
}

export const AudioCardContent = ({ cardContent, onDone }: AudioCardContentProps) => {
  const [selectedType, setSelectedType] = useState<SelectType>(null);
  
  return (
    <>
      { !cardContent._id && selectedType === null && (
        <Row justify="center" align="middle" style={{height: "100%"}}>
          <Col xs={24}>
            <Button type="text" onClick={() => setSelectedType(SelectType.RECORDER)}>RECORD</Button>
          </Col>
          <Col xs={24}>
            <Button type="text" onClick={() => setSelectedType(SelectType.UPLOADER)}>UPLOAD</Button>
          </Col>
        </Row>
      )}
      { !cardContent._id && selectedType !== null && (
        <>
          <Row justify="center" align="middle" style={{height: "80%"}}>
            <Col xs={24}>
              { selectedType === SelectType.RECORDER && (<MemoryCardAudioRecorder onDone={onDone} />)}
              { selectedType === SelectType.UPLOADER && (<FileUploadComponent onDone={onDone}
                                                                              accept="audio/*"
                                                                              maxCountFileList={1} />)}
            </Col>
          </Row>
          <Row justify="center" align="middle" style={{height: "20%"}}>
            <Col xs={24}>
              <Button type="text" onClick={() => setSelectedType(null)}>BACK</Button>
            </Col>
          </Row>
        </>
      )}
      { cardContent._id && (
        <Row justify={"center"} align={"middle"} style={{height: "100%"}}>
          <Col xs={24}>
            <SimpleAudioComponent dataId={cardContent._id} />
          </Col>
        </Row>
      ) }
    </>
  );
}