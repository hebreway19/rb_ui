import { useTranslation } from "next-i18next";
import React, { useCallback } from "react";
import { Col, Popover, Row } from "antd";
import { HebTypography } from "../../../../../components/HebElements";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import { MemoryCard } from "../../../../../components/Memory/MemoryCard";
import { GameTaskExerciseTypes } from "../../../../../constants";
import { MemorySet } from "../../../../../types";

type MemorySetListProp = {
  errorsSet: { setIndex: number, errors: string[], cardIndexes: number[] }[],
  sets: MemorySet[],
  currentIndex: number,
  onSelect(index: number): void,
  onSetsUpdate(newSets: MemorySet[]): void
}
export type CardContentProps = {
  errorsList: string[],
  set: MemorySet,
  isOpen: boolean,
  isWrong: boolean,
  onSetUpdate(set: MemorySet): void,
  onSelectHandle(): void,
}

export const CardContent = ({set, onSelectHandle, isOpen, isWrong, errorsList}: CardContentProps) => {
  const { t } = useTranslation();
  const getGameTaskExerciseError = useCallback((errorType: string) => {
    return t(`pages.lesson.form.tasks.errors.${GameTaskExerciseTypes.Memory}.${errorType}`);
  }, [t]);
  
  const warningComponent = (color?: string) => (
    <div style={{ position: "absolute", top: ".5rem", left: "50%" }}>
      <Popover content={
        <React.Fragment>
          {errorsList.map((message, index) => <p key={index} style={{margin: ".3rem", padding: 0}}>{getGameTaskExerciseError(message)}</p>)}
        </React.Fragment>
      }>
        <WarningOutlined style={{color}} />
      </Popover>
    </div>
  )
  
  return (
    <>
      <MemoryCard onClick={onSelectHandle} isWrong={isWrong} isOpen={isOpen} customFront={
        <React.Fragment>
          {errorsList && errorsList?.length > 0 && warningComponent("#f9c475")}
          <Row justify="center" align="middle" style={{height: "100%"}}>
            <Col xs={24}>
              <HebTypography.Title level={3} style={{textAlign: "center", color: "#ffffff"}}>{set.title}</HebTypography.Title>
            </Col>
          </Row>
        </React.Fragment>
      } customBody={
        <React.Fragment>
          {errorsList && errorsList?.length > 0 && warningComponent()}
          <Row justify="center" align="middle" style={{height: "100%"}}>
            <Col xs={24}>
              <HebTypography.Title level={3} style={{textAlign: "center"}}>{set.title}</HebTypography.Title>
            </Col>
          </Row>
        </React.Fragment>
      } />
    </>
  )
}

export const MemorySetList = ({ sets, currentIndex, onSelect, onSetsUpdate, errorsSet }: MemorySetListProp) => {
  const {t} = useTranslation();
  const updateSetByIndex = useCallback((index: number) => (set: MemorySet) => {
    const newSets: MemorySet[] = sets;
    newSets[index] = set;
    onSetsUpdate(newSets);
  }, [sets, onSetsUpdate]);
  const onSelectHandle = useCallback((index) => () => {
    onSelect(currentIndex !== index ? index : null);
  }, [currentIndex, onSelect]);
  const createNewSet = useCallback(() => {
    const newSet: MemorySet = { title: `New set ${sets.length + 1}`, cards: [] };
    const newSetsList: MemorySet[] = [...sets, {...newSet}];
    onSetsUpdate(newSetsList);
    onSelect(sets.length);
  }, [sets, onSetsUpdate, onSelect]);
  const addSetTitle: string = t("actions.add.entity", {entity: t("entities.set")});
  return (
    <Row gutter={[16, 16]} wrap={false} style={{overflowX: "auto", overflowY: "hidden"}}>
      { sets?.map((set, index) => {
        return (
          <Col xs={6} key={index}>
            <CardContent set={set} isOpen={currentIndex === index}
                         errorsList={errorsSet.find(error => error.setIndex === index)?.errors || []}
                         isWrong={!!errorsSet.find(error => error.setIndex === index)}
                         onSetUpdate={updateSetByIndex(index)}
                         onSelectHandle={onSelectHandle(index)} />
          </Col>
        )})
      }
      <Col xs={6}>
        <MemoryCard onClick={createNewSet}
                    isOpen={true}
                    customBody={
                      <Row justify="center" align="middle" style={{height: "100%"}}>
                        <Col xs={24}>
                          <Row>
                            <Col xs={24}>
                              <PlusOutlined style={{fontSize: "2rem"}} />
                            </Col>
                            <Col xs={24}>
                              <h3 style={{textAlign: "center"}}>{addSetTitle}</h3>
                            </Col>
                          </Row>
                        </Col>
                       </Row>
                    } />
      </Col>
    </Row>
  );
}