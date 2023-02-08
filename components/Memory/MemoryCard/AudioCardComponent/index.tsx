import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button, Col, message, Row} from "antd";
import {LoadingOutlined, PauseCircleOutlined, PlayCircleOutlined, WarningOutlined} from "@ant-design/icons/lib";
import {useFileService} from "../../../../services";

export type AudioCardComponentProps = {
  dataId: string;
}

export type FileState = {
  error: Error;
  src: string;
}

export type PlayerState = {
  isLoading: boolean;
  isPlaying: boolean;
  isFinish: boolean;
}

export const ErrorPlace = ({errorMessage}: {errorMessage: string}) => {
  return (
    <Row>
      <Col xs={24}>
        <WarningOutlined />
      </Col>
      <Col xs={24}>
        <h4>{errorMessage}</h4>
      </Col>
    </Row>
  )
}

export const PlayerIconComponent = ({playerState}: {playerState: PlayerState}) => {
  if (playerState.isLoading) {
    return <LoadingOutlined />
  }
  if (playerState.isPlaying) {
    return <PauseCircleOutlined />
  }
  return <PlayCircleOutlined />
}

export const  AudioCardComponent = ({dataId}: AudioCardComponentProps) => {
  const fileService = useFileService();
  
  const [fileState, setFileState] = useState<FileState>({ error: null, src: null });
  const [playerState, setPlayerState] = useState<PlayerState>({isLoading: false, isPlaying: false, isFinish: true});
  
  const audioRef = useRef<HTMLAudioElement>();
  
  const loadFile = useCallback(async (fileId: string) => {
    setPlayerState((oldPlayerState: PlayerState) => ({...oldPlayerState, isLoading: true}));
    try {
      const loadedBlob: Blob = await fileService.downloadFile(fileId);
      const src: string = URL.createObjectURL(loadedBlob);
      setFileState(() => ({error: null, src}));
      audioRef.current.src = src;
    } catch (error) {
      setFileState(() => ({src: null, error}));
    }
    setPlayerState((oldPlayerState: PlayerState) => ({...oldPlayerState, isLoading: false}));
  }, [audioRef, fileService]);
  
  const playAudio = useCallback(() => {
    (!fileState.src && dataId) && loadFile(dataId);
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [fileState.src, dataId, loadFile, audioRef]);
  
  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [audioRef]);
  
  const playOrPauseAudio = useCallback(() => {
    try {
      !playerState.isPlaying ? playAudio()
        : pauseAudio();
      setPlayerState(oldState => ({...oldState, isPlaying: !oldState.isPlaying}));
    } catch (error) {
      console.error(error);
      message.warn(error.message);
    }
  }, [playerState.isPlaying, pauseAudio, playAudio]);
  
  useEffect(() => {
    let newAudio = audioRef.current;
    if (!newAudio) {
      newAudio = new Audio();
      newAudio.addEventListener("ended", () => setPlayerState(oldState => ({...oldState, isPlaying: false})));
      audioRef.current = newAudio;
    }
    return () => {
      newAudio && newAudio.removeEventListener("ended", () => setPlayerState(oldState => ({...oldState, isPlaying: false})));
    };
  }, [audioRef]);
  return (
    <Row justify={"center"} align={"middle"} style={{height: "100%"}}>
      <Col xs={24}>
        {!playerState.isLoading && fileState.error && <ErrorPlace errorMessage={fileState.error.message} /> }
        {!fileState.error && !playerState.isLoading && <Button onClick={playOrPauseAudio} icon={<PlayerIconComponent playerState={playerState} />} />}
      </Col>
    </Row>
  );
}