import React from "react";
import { Space } from "antd";

import { TextTaskContentEditForm } from "../index";
import { TaskContentType, TaskType } from "../../../../constants";
import { Exercise, TextContent } from "../../../../types";

class TextTaskProps {
  _id?: string;
  __t: string;
  index: number;
  content: TextContent[];
  exercises: Exercise[];
  showText?: boolean;
}

const defaultTextTaskContent = () => {
  return {
    he: "",
    he_nikkudot: "",
    __t: TaskContentType.TextContent,
    isVisibleForStudents: true
  } as TextContent;
};

const TextTask = ({
                           _id,
                           __t = TaskType.TextTask,
                           index,
                           content = [defaultTextTaskContent()]
                         }: TextTaskProps) => {
  const contentBlocks = content.map((contentItem, contentIndex) => <TextTaskContentEditForm __t={__t}
                                                                                            key={contentIndex}
                                                                                            taskIndex={index}
                                                                                            contentIndex={contentIndex}
                                                                                            content={contentItem}/>);
  return (
    <>
      <Space direction="vertical" style={{width: "100%"}}>
        {contentBlocks}
      </Space>
    </>
  );
}

export default TextTask;