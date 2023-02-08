import React from "react";
import { StandardAudioComponent } from "../../../../shared/components";

export const ContentAudio = ({dataId, mode = "edit", ...props}) => {
  return (<p><StandardAudioComponent dataId={dataId}/></p>);
};

 ContentAudio;
