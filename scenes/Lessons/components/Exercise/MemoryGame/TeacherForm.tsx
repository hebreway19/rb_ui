import { Col, Row } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { GameTaskExerciseTypes, MemoryCardType } from "../../../../../constants";
import { MemorySet as MemorySetType, TextContent } from "../../../../../types";
import { MemorySet } from "./MemorySet";
import { MemorySetList } from "./MemorySetList";

type ErrorSet = { setIndex: number, errors: string[], cardIndexes: number[] };

export const TeacherForm = ({sets = [], taskIndex, timeToSolve, updateExerciseByTaskIndexAndExerciseType, setIsExerciseHasErrors, writeableSets}) => {
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(null);
  const [newSets, setNewSets] = useState<MemorySetType[]>([]);
  const [errorSetList, setErrorSetList] = useState<ErrorSet[]>([]);
  const onSetsUpdateHandle = useCallback((newSets: MemorySetType[]) => {
    updateExerciseByTaskIndexAndExerciseType(taskIndex,
                                             GameTaskExerciseTypes.Memory,
                                             { timeToSolve, writeableSets, sets: newSets });
  }, [taskIndex, timeToSolve, updateExerciseByTaskIndexAndExerciseType, writeableSets]);
  const updateCurrentSet = useCallback((setContent: MemorySetType) => {
    const newSets: MemorySetType[] = [...sets];
    newSets[currentSetIndex] = setContent;
    setNewSets(newSets);
    onSetsUpdateHandle(newSets);
  }, [sets, currentSetIndex, onSetsUpdateHandle]);
  const onRemoveCurrentSet = useCallback(() => {
    const newSets = sets.filter((_, index) => index !== currentSetIndex);
    setNewSets(newSets);
    onSetsUpdateHandle(newSets);
    setCurrentSetIndex(null);
  }, [sets, currentSetIndex, onSetsUpdateHandle]);
  const checkValidateRule = useCallback((newSets: MemorySetType[]) => {
    const newErrorSetList: ErrorSet[] = newSets.map((set, index) => {
      let newErrorSet: ErrorSet = { setIndex: index, errors: [], cardIndexes: [] };
      const cardsErrors: string[] = set.cards.map((card, cardIndex) => {
        let message: string = null;
        if (card.__t === MemoryCardType.MediaMemoryCard) {
          if (!card.content._id) {
            message = "media_card_is_empty";
          }
        }
        if (card.__t === MemoryCardType.TextMemoryCard) {
          if (!(card.content as TextContent).he_nikkudot) {
            message = "text_card_is_empty";
          }
        }
        if (message !== null) { newErrorSet.cardIndexes.push(cardIndex); }
        return message
      }).filter(message => message !== null);
      if (cardsErrors.length > 0) {
        newErrorSet.errors = cardsErrors;
      }
      if (!set.title) {
        newErrorSet.errors.push("set_title_is_empty");
      }
      if (set.cards.length < 2) {
        newErrorSet.errors.push("set_card_length");
      }
      return newErrorSet;
    }).filter(item => item.errors.length > 0);
    setIsExerciseHasErrors && setIsExerciseHasErrors(newErrorSetList.length > 0);
    setErrorSetList(newErrorSetList);
  }, [setIsExerciseHasErrors]);
  useEffect(() => {
    checkValidateRule(newSets);
  }, [newSets])
  useEffect(() => {
    setNewSets(sets);
  }, [sets]);
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        <MemorySetList sets={sets} onSelect={setCurrentSetIndex}
                       errorsSet={errorSetList}
                       currentIndex={currentSetIndex}
                       onSetsUpdate={onSetsUpdateHandle} />
      </Col>
      { newSets?.map((set, indexSet: number) => (
        <Col xs={24} hidden={currentSetIndex !== indexSet} key={indexSet}>
          <MemorySet onRemoveCurrentSet={onRemoveCurrentSet}
                     currentSetErrors={errorSetList.find(item => item.setIndex === indexSet)?.cardIndexes || []}
                     memorySet={set} onUpdateCurrentSet={updateCurrentSet} />
        </Col>
      )) }
    </Row>
  );
}