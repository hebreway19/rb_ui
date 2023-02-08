import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import dynamic from "next/dynamic";

import { useFileService } from "../../../../services";
import "react-h5-audio-player/lib/styles.css";

const AudioPlayer = dynamic(() => import("react-h5-audio-player"), {ssr: false, loading: () => <Spin/>});

type AudioState = {
  didLoaded: boolean;
  src?: string;
  error?: string;
}

export const StandardAudioComponent = ({dataId}) => {
  const [audioState, setAudioState] = useState<AudioState>({
                                                             didLoaded: true,
                                                             src: "",
                                                             error: ""
                                                           });
  const fileService = useFileService();
  useEffect(() => {
    const loadFile = async (fileId) => {
      try {
        const loadedBlob = await fileService.downloadFile(fileId);
        const src = URL.createObjectURL(loadedBlob);
        setAudioState({didLoaded: false, src});
      }
      catch (error) {
        setAudioState({didLoaded: true, error});
      }
    };
    (dataId) && loadFile(dataId);
  }, [dataId, audioState.didLoaded]);

  return (
    <Spin spinning={audioState.didLoaded}>
      <div lang="en" dir="ltr">
        <AudioPlayer src={audioState.src}
                     preload="metadata"
                     showJumpControls={false}
                     autoPlay={false}
                     autoPlayAfterSrcChange={false}/>
      </div>
    </Spin>
  );
};