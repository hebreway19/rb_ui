import React from "react";
import { List } from "antd";
import { LessonItem } from "./LessonItem";

export const LessonsList = ({lessons}) => {
  return (
    <List
      style={{marginTop: 33, direction: "rtl"}}
      className="day-details__lessons-list"
      itemLayout="vertical"
      bordered
      dataSource={lessons}
      renderItem={(lesson, index) => <React.Fragment key={index}>
                                       <LessonItem lesson={lesson} />
                                     </React.Fragment>}
    />
  )
}