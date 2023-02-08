import React, { useEffect, useState, useCallback } from "react";
import { Image, message, Row, Col } from "antd";
import { useFileService } from "../../../../../../services";
import { ImageUploadComponent } from "../../../../../../shared/components/FileComponents";
import { MediaContent } from "../../../../../../types";

export type ImageCardContentProps = {
  cardContent: MediaContent,
  onDone;
}

export const ImageCardContent = ({ cardContent, onDone }: ImageCardContentProps) => {
  const fileService = useFileService();
  const [currentImage, setCurrentImage] = useState<string>(null);
  
  const loadData = useCallback(async (fileId: string) => {
    let src: string = null;
    try {
      const loadedBlob = await fileService.downloadFile(fileId);
      src = URL.createObjectURL(loadedBlob);
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
    setCurrentImage(src);
  }, [fileService])
  
  useEffect(() => {
    cardContent._id && loadData(cardContent._id);
    !cardContent._id && setCurrentImage(null);
  }, [cardContent._id, loadData]);
  
  return (
    <Row style={{height: "100%"}} align="middle" justify="center">
      <Col xs={24}>
        { currentImage && <Image src={currentImage} /> }
        { !currentImage && <ImageUploadComponent maxCountFileList={1}
                                                 autoRemoveFileList={true}
                                                 onDone={onDone}
        /> }
      </Col>
    </Row>
  )
}