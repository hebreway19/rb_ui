import React from "react";
import { HebTypography } from "../../../../../components/HebElements";
import { Col, Divider, Row } from "antd";

export const ViewQuestionForm = ({
                                   sentence,
                                   answer,
                                   questionIndex,
                                   isStart = true
                                 }) => {
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={22}>
          <HebTypography.Paragraph dir="rtl"
                                   style={{marginBottom: 0, textAlign: "right"}}>
            <HebTypography.Text hidden={isStart}
                                mark
                                bold
                                lang="he">
              {answer || ""}
            </HebTypography.Text>
            <HebTypography.Text lang="he">
              {` ${sentence?.he_nikkudot || sentence?.he || ""} `}
            </HebTypography.Text>
            <HebTypography.Text hidden={!isStart}
                                mark
                                bold
                                lang="he">
              {answer || ""}
            </HebTypography.Text>
          </HebTypography.Paragraph>
        </Col>
        <Col xs={2}>
          <HebTypography.Paragraph>
            <HebTypography.Text bold
                                lang="he">
              .{questionIndex + 1}
            </HebTypography.Text>
          </HebTypography.Paragraph>
        </Col>
      </Row>
      <Divider />
    </>
  )
}