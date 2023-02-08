import React, { useState } from "react";
import { Col, Image, List, Row } from "antd";
import { ApiEndpoint } from "../../../../constants";
import { Controls } from "./Controls";
import { useStudentTasksAnswersForm } from "../../../../providers";

export const FileListItem = ({
                               answerContent,
                               answerIndex,
                               reviewedBy,
                               lessonType,
                               role
                             }) => {
  const {handleTaskAnswerChange} = useStudentTasksAnswersForm();
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const imageContent = <Image src={`${ApiEndpoint.FILE}/download/${answerContent.files}`} />;
  const listItem = (
    <List.Item>
      <Row gutter={[8, 8]}>
        <Col xs={6}>
          {imageContent}
        </Col>
        <Col xs={18}>
          <Controls lessonType={lessonType}
                    isTouched={isTouched}
                    setIsTouched={setIsTouched}
                    reviewedBy={reviewedBy}
                    isFileAnswer={true}
                    role={role}
                    answerIndex={answerIndex}
                    answerContent={answerContent}
                    handleTaskAnswerChange={handleTaskAnswerChange}
          />
        </Col>
      </Row>

    </List.Item>
  );
  return <>{listItem}</>
}