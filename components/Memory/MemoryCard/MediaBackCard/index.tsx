import React, {useCallback, useEffect, useState} from "react";
import { MediaContent } from "../../../../types";
import { Col, Row, Image } from "antd";
import { useFileService } from "../../../../services";
import { AudioCardComponent } from "../AudioCardComponent";

type MediaBackCard = {
  content: MediaContent
}

export const MediaBackCard = ({content}: MediaBackCard) => {
  const [fileState, setFileState] = useState({didLoaded: false, src: "", error: ""});
  
  const filesService = useFileService();
  
  const loadFile = useCallback(async (fileId) => {
    try {
      const loadedBlob = await filesService.downloadFile(fileId);
      const src = URL.createObjectURL(loadedBlob);
      setFileState({didLoaded: true, src, error: ""});
    }
    catch (error) {
      setFileState({didLoaded: true, error, src: ""});
    }
  }, [filesService]);
  
  useEffect(() => {
    if (!!content._id && !fileState.didLoaded && content.mimeType.toLowerCase().includes("image")) {
      loadFile(content._id)
    }
  }, [content._id]);
  
  return (
    <Row style={{height: "100%"}}>
      { content.mimeType.toLowerCase().includes("image") &&
      <Col xs={24} style={{height: "100%"}}>
          <Image src={fileState.src} />
      </Col>
      }
      { content.mimeType.toLowerCase().includes("audio") &&
      <Col xs={24} style={{height: "100%", padding: ".4rem"}}>
          <AudioCardComponent dataId={content._id} />
      </Col>
      }
    </Row>
  );
}