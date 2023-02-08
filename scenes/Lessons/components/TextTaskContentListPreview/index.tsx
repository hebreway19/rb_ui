import React from "react";
import { Col, Divider, Row } from "antd";

import { TextTaskContentItemPreview } from "../index";
import { useStudentTasksAnswersForm } from "../../../../providers";
import { Task, TextContent } from "../../../../types";
import { TaskType } from "../../../../constants";

const defaultTextTask = () => ({content: [], __t: TaskType.TextTask}) as Task<TextContent>;

type TextTaskContentListPreviewProps = {
  task: Task<TextContent>;
  mode: "preview" | "default";
};

export const TextTaskContentListPreview = ({task = defaultTextTask(), mode}: TextTaskContentListPreviewProps) => {
  const {formState} = useStudentTasksAnswersForm();
  const columnSizeMd = formState.isVisibleTranslate
                       ? 12
                       : 24;

  const content = task.content
                      .filter(taskContent => taskContent.isVisibleForStudents)
                      .reduce((items, currentValue, index) =>
                                currentValue
                                ? [
                                    ...items,
                                    (
                                      <Row gutter={8} justify="center" wrap={false}
                                           align="bottom" key={`separator${index}`}>
                                        {
                                          formState.isVisibleTranslate && (
                                            <>
                                              <Col flex="auto">
                                                <Divider type="horizontal"/>
                                              </Col>
                                            </>
                                          )
                                        }
                                        <Col xs={24} md={columnSizeMd}>
                                          <Divider type="horizontal"/>
                                        </Col>
                                      </Row>
                                    ),
                                    <TextTaskContentItemPreview taskContent={currentValue} key={index} columnSizeMd={columnSizeMd}/>
                                  ]
                                : items, []);
  return (
    <Row className={`${mode === "default" ? "answer-text" : "paragraph-text"}`}>
      <Col flex="auto">
        {content}
      </Col>
    </Row>
  );
};

export default TextTaskContentListPreview;