import { LoadingOutlined, PauseOutlined } from "@ant-design/icons";
import { Button, message, Tooltip } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";
import { useFileService } from "../../../../services";

const playIconSvg = (
  <svg width="1em" height="1em" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.5 0.0625C6.52715 0.0625 0.0625 6.52715 0.0625 14.5C0.0625 22.4729 6.52715 28.9375 14.5 28.9375C22.4729 28.9375 28.9375 22.4729 28.9375 14.5C28.9375 6.52715 22.4729 0.0625 14.5 0.0625ZM14.5 26.4883C7.88066 26.4883 2.51172 21.1193 2.51172 14.5C2.51172 7.88066 7.88066 2.51172 14.5 2.51172C21.1193 2.51172 26.4883 7.88066 26.4883 14.5C26.4883 21.1193 21.1193 26.4883 14.5 26.4883Z"
      fill="#75ECF9"/>
    <path
      d="M21.1838 14.0845L11.6415 7.15578C11.565 7.09968 11.4744 7.06593 11.3798 7.0583C11.2852 7.05067 11.1904 7.06945 11.1058 7.11255C11.0213 7.15566 10.9504 7.22139 10.901 7.30242C10.8516 7.38346 10.8257 7.47661 10.8262 7.5715V21.4289C10.8262 21.8511 11.3031 22.0896 11.6415 21.8446L21.1838 14.9159C21.2497 14.8685 21.3033 14.806 21.3403 14.7337C21.3773 14.6615 21.3966 14.5814 21.3966 14.5002C21.3966 14.419 21.3773 14.339 21.3403 14.2667C21.3033 14.1944 21.2497 14.132 21.1838 14.0845V14.0845ZM12.8822 18.4028V10.5976L18.2544 14.5002L12.8822 18.4028V18.4028Z"
      fill="#75ECF9"/>
  </svg>

);

export const SimpleAudioComponent = ({dataId}) => {
  const {t} = useTranslation();
  const [fileState, setFileState] = useState({
                                               isLoading: true,
                                               error: null,
                                               src: null
                                             });
  const fileService = useFileService();
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>();
  const [audioState, setAudioState] = useState({
                                                 isLoading: false,
                                                 isPlaying: false,
                                                 isFinish: true
                                               });
  const loadFile = useCallback(async (fileId) => {
    setIsLoading(true);
    try {
      const loadedBlob = await fileService.downloadFile(fileId);
      const src = URL.createObjectURL(loadedBlob);
      setFileState({
                     error: null,
                     isLoading: false,
                     src: src
                   });
      audioRef.current.src = src;
    }
    catch (error) {
      console.error(error);
      setFileState({
                     error: error,
                     isLoading: false,
                     src: null
                   });
    }
    finally {
      setIsLoading(false);
    }
  }, [audioRef, fileService]);

  const playAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [audioRef]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [audioRef]);

  const playOrPauseAudio = useCallback(() => {
    (!fileState.src && dataId) && loadFile(dataId);
    try {
      !audioState.isPlaying ? playAudio() 
                            : pauseAudio();
      setAudioState(oldState => ({...oldState, isPlaying: !oldState.isPlaying}));
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
  }, [audioState.isPlaying, dataId, fileState.src, loadFile, pauseAudio, playAudio]);

  useEffect(() => {
    let newAudio = audioRef.current;
    if (!newAudio) {
      newAudio = new Audio();
      newAudio.addEventListener("ended", () => setAudioState(oldState => ({...oldState, isPlaying: false})));
      audioRef.current = newAudio;
    }
    return () => {
      newAudio && newAudio.removeEventListener("ended", () => setAudioState(oldState => ({...oldState, isPlaying: false})));
    };
  }, [audioRef]);

  const playerLabel = audioState.isPlaying 
                      ? t("components.audio.simple.pause.tooltip")
                      : t("components.audio.simple.play.tooltip");
  const playerTooltip = t("tooltips.press_to_action", {action: playerLabel.toLowerCase()});
  
  return (
    <Tooltip placement="top"
             title={nl2br(playerTooltip)}>
      <Button type="text" onClick={playOrPauseAudio} icon={audioState.isPlaying ? isLoading ? <LoadingOutlined/>
                                                                                            : <PauseOutlined/>
                                                                                : playIconSvg
      }/>
    </Tooltip>
      
  );
}