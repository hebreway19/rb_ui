import { Button, Col, Row, Space } from "antd";
import React from "react";
import { FilterItem } from "./FilterItem";
import { useStudentTasksAnswersAnswerList } from "../../../../providers";

export const AnswersFilterParams = () => {
  const {answerListState} = useStudentTasksAnswersAnswerList();
  const filterItems = answerListState.filterProps.map((item) => <FilterItem key={item.name}
                                                                                   filterName={item.name} />);
  return (
    <Row justify="end">
      <Col xs={24}
           lg={12}>
        <Space style={{width: "100%"}}
               direction="vertical">
          {filterItems}
          <Row justify="end">
            <Col>
              <Button>filter</Button>
            </Col>
          </Row>
        </Space>
      </Col>
    </Row>
  );
}