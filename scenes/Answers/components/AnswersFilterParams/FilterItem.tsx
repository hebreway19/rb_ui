import { Col, Input, Row, Switch, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useStudentTasksAnswersAnswerList } from "../../../../providers";

export const FilterItem = ({ filterName }) => {
  const { answerListState, setAnswerListState } = useStudentTasksAnswersAnswerList();
  const { t } = useTranslation();
  const [filterIndex, setFilterIndex] = useState<number>(0);
  const [currentFilterState, setCurrentFilterState] = useState(null);

  const changeFilterState = useCallback(({ value, event }) => {
    setCurrentFilterState(oldState => ({
      ...oldState,
      value: event?.target?.value || oldState.value,
      isFiltered: value || !oldState.isFiltered
    }));
    setAnswerListState(oldState => {
      oldState.filterProps[filterIndex] = currentFilterState;
      return oldState;
    })
  }, [currentFilterState, filterIndex, setAnswerListState]);

  const getFilterLabelByName = useCallback(name => t(`pages.answers.filter.params.${name}.label`), [t]);

  useEffect(() => {
    setFilterIndex(answerListState?.filterProps.findIndex(item => item.name === filterName))
  }, [filterName, answerListState?.filterProps]);

  useEffect(() => {
    setCurrentFilterState(answerListState?.filterProps[filterIndex]);
  }, [filterIndex, answerListState?.filterProps]);

  return (
    <Row gutter={8}
    >
      <Col xs={6}>
        <Typography.Title level={5}
                          style={{textAlign: "right"}}>
          {getFilterLabelByName(filterName)}
        </Typography.Title>
      </Col>
      <Col xs={2}>
        <Switch checked={currentFilterState?.isFiltered}
                onChange={e => changeFilterState({value: e})} />
      </Col>
      <Col xs={16}>
        <Input defaultValue={currentFilterState?.value}
               onChange={e => changeFilterState({value: true, event: e})} />
      </Col>
    </Row>
  );
}