import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "antd";
import { HebForm, HebTextArea, HebTypography } from "../../../../../components/HebElements";
import { MemoryCard } from "../../../../../components/Memory/MemoryCard";
import { GameTaskAnswersTypes, UserRole } from "../../../../../constants";
import { LocalizedContent, MemoryCard as MemoryCadModel, MemorySet } from "../../../../../types";
import { ArrayUtil } from "../../../../../util";
import {useTranslation} from "next-i18next";

type StudentFormProps = {
  _id: string,
  title: LocalizedContent,
  sets: MemorySet[],
  activeCards: string[],
  pronounceableSets: MemorySet[] | string[],
  writeableSets: string[],
  answer: any,
  role: UserRole,
  setAnswer(value: any): void,
  commitAnswer(_id: string, value): void,
}

export const StudentForm = ({ _id, title, sets, activeCards, answer, role,
                              commitAnswer, setAnswer, writeableSets}: StudentFormProps) => {
  const {t} = useTranslation();
  const [displayedCards, setDisplayedCards] = useState<MemoryCadModel[]>([]);
  const [selectedSet, setSelectedSet] = useState<string>('');
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [currentWrittenText, setCurrentWrittenText] = useState(answer?.writtenText || {});
  
  const findSetByCardId = useCallback((cardId: string) => {
    return sets.find(set => set.cards.find(card => card._id === cardId) !== undefined)
  }, [sets]);
  
  const updateAnswer = useCallback((event, setId) => {
    role === UserRole.STUDENT && setAnswer && setAnswer(oldState => {
      let newAnswer: any = {...oldState};
      newAnswer.__t = GameTaskAnswersTypes.Memory;
      newAnswer.writtenText = {...oldState.writtenText, [setId]: event.target.value};
      return newAnswer;
    })
  }, [setAnswer, role]);
  
  useEffect(() => {
    setCurrentWrittenText(answer?.writtenText);
  }, [answer]);
  
  const addNewCard = useCallback(async (cardId: string) => {
    const currentSetId = findSetByCardId(cardId)?._id;
    let currentCardLength: number = selectedCards.length + 1;
    let isFinishStep: boolean = false;
    setSelectedCards(oldState => oldState.includes(cardId) ? oldState : [...oldState, cardId]);
    if (selectedSet === '') {
      setSelectedSet(currentSetId);
    } else if (currentCardLength === sets.find(set => set?._id === selectedSet)?.cards?.length && selectedSet === currentSetId) {
      const newAnswer = {...answer, __t: GameTaskAnswersTypes.Memory,
        cardsInUse: cardId, guessedSets: [...answer?.guessedSets || [], currentSetId]};
      isFinishStep = true;
      await commitAnswer(_id, newAnswer);
    } else if (selectedSet !== currentSetId) {
      setIsDisabled(true);
      setTimeout(() => {
        setSelectedSet('');
        setSelectedCards([]);
        setIsDisabled(false);
      }, 1500)
    }
    if (isFinishStep) {
      setIsDisabled(true);
      setTimeout(async () => {
        setSelectedSet('');
        setSelectedCards([]);
        setIsDisabled(false);
      }, 1500);
    }
  }, [_id, sets, answer, commitAnswer, selectedCards, selectedSet, findSetByCardId]);
  
  const onClickHandle = useCallback((cardId: string) => {
    !isDisabled && addNewCard(cardId);
  }, [isDisabled, addNewCard]);
  
  useEffect(() => {
    setDisplayedCards(ArrayUtil.shuffle((sets || []).map(set => set.cards).flat()
                                            .filter(card => activeCards.includes(card._id))));
  }, []);

  const writtenTextTitle: string = t("pages.lesson.form.tasks.exercises.writtenText.title");
  const writtenTextDescription: string = t("pages.lesson.form.tasks.exercises.writtenText.description");

  return (
    <Row gutter={[0, 16]}>
      <Col xs={24}>
        <HebTypography.Title lang="he" dir="rtl" level={3}>
          { title?.he_nikkudot || title?.he }
        </HebTypography.Title>
      </Col>
      <Col xs={24}>
        <Row gutter={[8, 8]}>
          { displayedCards.map((card) => {
            const setId: string = sets.find(set => set.cards.some(cardContent => cardContent._id === card._id))._id;
            return (
              <Col xs={6} key={card._id}>
                <MemoryCard card={card}
                            isCorrect={answer?.guessedSets?.includes(setId) && !selectedCards.includes(card._id)}
                            isOpen={selectedCards.includes(card._id)}
                            onClick={() => !(answer?.guessedSets?.includes(setId) || selectedCards.includes(card._id)) && onClickHandle(card._id) }
                />
              </Col>
            )
          }) }
        </Row>
      </Col>
      <Col xs={24} hidden={ sets?.length > (answer?.guessedSets?.length || 0) || !writeableSets }>
        <h3>{ writtenTextTitle }</h3>
        <p>{ writtenTextDescription }</p>
      </Col>
      <Col xs={24} hidden={ sets?.length > (answer?.guessedSets?.length || 0) || !writeableSets }>
        <Row>
          { writeableSets && writeableSets?.map((setId: string, index: number) => (
            <Col xs={24} key={index}>
              <h3 lang="he" dir="rtl">{sets.find((item) => item._id === setId)?.title}</h3>
              <HebForm.Item initialValue={currentWrittenText?.[setId] || ""}
                            value={currentWrittenText?.[setId] || ""}
                            rules={[
                              {required: true}
                            ]}>
                <HebTextArea lang="he" dir="rtl"
                             onChange={e => updateAnswer(e, setId)}
                             value={currentWrittenText?.[setId] || ""} />
              </HebForm.Item>
            </Col>
          )) }
        </Row>
      </Col>
    </Row>
  );
}