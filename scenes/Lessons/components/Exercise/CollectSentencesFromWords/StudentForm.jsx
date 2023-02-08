import { Button, Col, Divider, Row, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";
import { ExerciseType, StudentAnswerType } from "../../../../../constants";
import { ArrayUtil, StringUtil } from "../../../../../util";

const QuestionForm = ({
                        sentence = {
                          he: "",
                          he_nikkudot: ""
                        },
                        answer,
                        updateAnswer,
                        questionIndex,
                        ...props
                      }) => {
  const {t} = useTranslation();
  const [currentAnswer, setCurrentAnswer] = useState([]);
  const [wordsList, setWordsList] = useState([]);
  const [disabledButtonIndexArray, setDisabledButtonIndexArray] = useState([]);
  const addWordToAnswer = useCallback((word, index) => {
    let newAnswer = currentAnswer.slice();
    newAnswer.push(word);
    updateAnswer(newAnswer.join(" "));
  }, [currentAnswer, updateAnswer]);
  const removeWordFromAnswer = useCallback((word, index) => {
    let newAnswer = currentAnswer.slice();
    const indexWordInCurrentAnswer = currentAnswer.indexOf(word);
    newAnswer.splice(indexWordInCurrentAnswer, 1);
    updateAnswer(newAnswer.join(" "));
  }, [currentAnswer, updateAnswer]);
  const clearAnswer = useCallback(() => {
    const newAnswer = [];
    updateAnswer(newAnswer.join(" "));
  }, [updateAnswer]);

  useEffect(() => {
    const newWordList = answer ? StringUtil.convertSentenceToWordArray(answer) : [];
    setCurrentAnswer(newWordList);
  }, [answer, sentence.he]);

  useEffect(() => {
    const shuffledWordsList = ArrayUtil.shuffle(StringUtil.convertSentenceToWordArray(sentence.he.replace(/\s+/g, ' ').trim()));
    setWordsList(shuffledWordsList);
  }, [sentence.he]);

  useEffect(() => {
    let selectedWordList = answer ? StringUtil.convertSentenceToWordArray(answer)
                                  : [];
    let wordsListCopy = wordsList.slice();
    let selectedWordIndexes = [];
    selectedWordList.forEach((selectedWord, index) => {
      const wordIndexInText = wordsListCopy.findIndex(word => selectedWord === word);
      if (wordIndexInText > -1) {
        selectedWordIndexes.push(wordIndexInText);
        wordsListCopy[wordIndexInText] = null;
      }
    });
    setDisabledButtonIndexArray(selectedWordIndexes);
  }, [answer]);

  const entity = t("entities.sentence");
  const clearButton = t("actions.clear.plain");
  const exerciseDescription = t(`pages.lesson.form.tasks.exercises.types.${ExerciseType.CollectSentencesFromWords}.description`);
  const resultSentenceLabel = t("pages.lesson.form.tasks.exercises.result_sentence.label");
  const suggestedWords = t("pages.lesson.form.tasks.exercises.suggested_words.label");
  const getQuestionTitle = useCallback(number => t("pages.lesson.form.tasks.exercises.question.title.entity_and_number", {entity: entity, number: number}), [entity, t]);

  return (
    <div className="collect-sentences">
      <Row dir="rtl">
        <Col xs={20}>
          <Typography.Title level={4} style={{textAlign: "right"}}>{nl2br(getQuestionTitle(questionIndex + 1))}</Typography.Title>
        </Col>
        <Col xs={4}
             hidden={currentAnswer.length === 0}
             style={{textAlign: "right"}}>
          <Button type="text"
                  style={{color: "#ffffff", border: "2px solid #75ECF9"}}
                  onClick={() => clearAnswer()}>
            {clearButton}
          </Button>
        </Col>
      </Row>
      <Divider hidden={currentAnswer.length === 0}
               orientation="right">
        <Typography.Text>{resultSentenceLabel}</Typography.Text>
      </Divider>
      <Row gutter={[8, 8]}
           style={{marginBottom: 16, marginTop: 16, minHeight: 32}}
           dir={currentAnswer.length === 0 ? "ltr" : "rtl"}>
        { currentAnswer.length === 0
          ? <Col xs={24} style={{textAlign: "right"}}>
              <Typography.Text>{exerciseDescription}</Typography.Text>
            </Col>
          : currentAnswer.map((word, wordIndex) => (
            <Col key={wordIndex}>
              <Button block
                      type="text"
                      style={{color: "#ffffff", border: "2px solid #75ECF9"}}
                      onClick={() => removeWordFromAnswer(word, wordIndex)}>
                {word}
              </Button>
            </Col>
          )) 
        }
      </Row>
      <Divider orientation="right"><Typography>{suggestedWords}</Typography></Divider>
      <Row gutter={[8, 8]}
           dir="rtl">
        { wordsList.map((word, wordIndex) => (
            <Col key={wordIndex}
                 hidden={disabledButtonIndexArray.includes(wordIndex)}>
              <Button block
                      type="text"
                      style={{color: "#ffffff", border: "2px solid #75ECF9"}}
                      onClick={() => addWordToAnswer(word, wordIndex)}>
                {word}
              </Button>
            </Col>
          ))
        }
      </Row>
    </div>
  );
}

const QuestionViewer = ({
                          sentence,
                          questionIndex,
                          answer,
                          ...props
                        }) => {
  const {t} = useTranslation();
  
  const entity = t("entities.sentence");
  const getQuestionTitle = useCallback(number => t("pages.lesson.form.tasks.exercises.question.title.entity_and_number", {entity: entity, number: number}), [entity, t]);

  const studentAnswerLabel = t("pages.lesson.form.tasks.exercises.student_answer.simple");
  const originalSentenceLabel = t("pages.lesson.form.tasks.exercises.sentence.simple");

  const [correctWordList] = useState(StringUtil.convertSentenceToWordArray(sentence.he || ""));
  const [studentWordList] = useState(StringUtil.convertSentenceToWordArray(answer || ""));
  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={22}>
          <Row>
            <Col xs={4}>
              <Typography.Text strong>{originalSentenceLabel}:</Typography.Text>
            </Col>
            <Col xs={20}>
              <Typography.Paragraph lang="he"
                                    dir="rtl"
                                    style={{textAlign: "right", marginBottom: 5}}>
                {sentence.he}
              </Typography.Paragraph>
            </Col>
          </Row>
          <Row>
            <Col xs={5}>
              <Typography.Text strong>{studentAnswerLabel}:</Typography.Text>
            </Col>
            <Col xs={19}>
              <Typography.Paragraph lang="he"
                                    dir="rtl"
                                    style={{textAlign: "right", marginBottom: 5}}>
                { studentWordList.map((word, wordIndex) => (
                    <span style={{
                      color: correctWordList[wordIndex] === word ? "#1e9c73"
                                                                 : "#de9b16"
                    }}>{`${word} `}</span>
                  ))
                }
              </Typography.Paragraph>
            </Col>
          </Row>
        </Col>
        <Col xs={2}>
          <Typography.Paragraph lang="he">
            .{questionIndex + 1}
          </Typography.Paragraph>
        </Col>
      </Row>
      <Divider />
    </>
  );
}

export const StudentForm = ({
                              taskIndex,
                              __t,
                              _id,
                              mode,
                              questions = [],
                              answer = {answer: []},
                              commitAnswer,
                              ...props
                            }) => {
  const updateAnswer = useCallback((questionIndex) => async (questionAnswer) => {
    const newAnswers = (answer?.answers || []);
    newAnswers[questionIndex] = questionAnswer;
    await commitAnswer(_id, {
      ...answer,
      __t: StudentAnswerType.CollectSentencesFromWordsAnswer,
      answers: newAnswers
    });
  }, [_id, answer, commitAnswer]);

  const list = questions.map((question, questionIndex) => {
    const studentAnswer = answer?.answers && answer.answers[questionIndex];
    return mode === "view"
           ? <QuestionViewer key={questionIndex}
                             answer={studentAnswer}
                             questionIndex={questionIndex}
                             {...question} />
           : <QuestionForm key={questionIndex}
                           updateAnswer={updateAnswer(questionIndex)}
                           questionIndex={questionIndex}
                           answer={studentAnswer}
                           {...question} />
  });

  return (
    <>
      <Row gutter={[8, 8]} style={{marginBottom: 16}}>
        { list.map((questionForm, questionIndex) => (
            <Col xs={24}
                 key={questionIndex}>
              {questionForm}
            </Col>
          ))
        }
      </Row>
    </>
  )
}