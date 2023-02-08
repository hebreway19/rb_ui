import React, { useEffect, useState } from "react";
import { Image } from "antd";

import { useFileService } from "../../../../services";

export const ContentImage = ({dataId, mode = "edit", ...props}) => {
  const [imageState, setImageState] = useState({didLoaded: false, src: "", error: ""});
  const fileService = useFileService();
  useEffect(() => {
    const loadImage = async (imageId) => {
      try {
        const loadedBlob = await fileService.downloadFile(imageId);
        const src = URL.createObjectURL(loadedBlob);
        setImageState({didLoaded: true, src, error: ""});
      }
      catch (error) {
        setImageState({didLoaded: true, error, src: ""});
      }
    };
    (dataId && !imageState.didLoaded) && loadImage(dataId);
  }, [dataId, imageState.didLoaded, fileService]);
  return (
    <p className="display_block">
      <Image style={{maxHeight: "30vh", width: "auto", maxWidth: "66%", margin: "0 auto"}} src={imageState.src} {...{dataId}} preview/>
    </p>);
};