import React, { useCallback, useState } from "react";
import { Col, Form, Row } from "antd";
import { ExerciseType, UserRole } from "../../../../../constants";
import { StringUtil } from "../../../../../util";
import { DeleteOutlined, MinusCircleOutlined, PlusSquareOutlined, SaveOutlined } from "@ant-design/icons";
import { merge } from "lodash";
import { WordComponent } from "../WordComponent";
import { HebButton, HebForm, HebInput, HebPopover, HebTypography } from "../../../../../components/HebElements";
import { useLessonForm } from "../../../../../providers";
import { TextContent } from "../../../../../types";

export const WordItem = ({
                           word = "",
                           wordBody = {positionInText: -1, wrongAnswers: [""]},
                           select,
                           unselect
                         }) => {
  const [isSelected, setIsSelected] = useState(false);
  const isLastCharacterSpecial = /[;.,:?"'!]/g.test(word[word.length - 1]);

  const saveChanges = useCallback(({wrongAnswers}) => {
    select({wrongAnswers});
    setIsSelected(false);
  }, [wordBody, select]);

  const removeWord = useCallback((wordBody) => {
    unselect(wordBody);
    setIsSelected(false);
  }, [unselect]);

  const formComponent = (
    <Form name="word" autoComplete="off" lang={"he"} dir={"rtl"} onFinish={saveChanges}>
      <Form.List name="wrongAnswers" initialValue={wordBody.wrongAnswers}>
        {
          (fields, {add, remove}) => (
            <>
              {fields.map(({key, name, ...restField}) => {
                return (
                  <Row key={key} gutter={8}>
                    <Col xs={20}>
                      <HebForm.Item
                        {...restField}
                        name={name.toString()}
                        fieldKey={restField['fieldKey']}
                        rules={[{required: true, message: "Missing variant"}]}
                      >
                        <HebInput cssType="primary" placeholder="" />
                      </HebForm.Item>
                    </Col>
                    <Col xs={4}>
                      <HebButton onClick={() => remove(name)}
                                 buttonSize="small"
                                 viewType="text"
                                 disabled={!(fields.length > 1)}
                                 icon={<MinusCircleOutlined />}/>
                    </Col>
                  </Row>
                )
              })}
              <Row style={{marginTop: 10}}
                   gutter={[8, 8]}>
                <Col xs={24}
                     hidden={fields.length >= 3}>
                  <HebButton viewType="primary-v2"
                             buttonSize="over-small"
                             onClick={() => add()}
                             title={"Add variant"}
                             block
                             icon={<PlusSquareOutlined />}/>
                </Col>
                <Col flex="auto"
                     hidden={fields.length <= 0}>
                  <HebButton viewType="primary"
                             buttonSize="over-small"
                             htmlType={"submit"}
                             block
                             icon={<SaveOutlined />}/>
                </Col>
                <Col flex="auto"
                     hidden={wordBody.positionInText < 0}>
                  <HebButton viewType="primary-v2"
                             buttonSize="over-small"
                             onClick={() => removeWord(wordBody)}
                             title={"Remove"}
                             block
                             icon={<DeleteOutlined />}/>
                </Col>
              </Row>
            </>
          )
        }
      </Form.List>
    </Form>);
  return (
    <span style={{margin: "auto 2px"}}>
      <HebPopover title={<p dir="rtl" lang="he" style={{
        textAlign: "right",
        color: "#ffffff",
        width: "100%",
        margin: 0
      }}>
        {isLastCharacterSpecial ? word.substring(0, word.length - 1)
          : word}
      </p>}
                  placement="bottom" visible={isSelected} onVisibleChange={setIsSelected} content={formComponent} trigger="click">
        <HebTypography.Text>
          <WordComponent role={UserRole.TEACHER}
                         word={word}
                         style={{
                           cursor: "pointer",
                           color: "#ffffff"
                         }}
                         mark={wordBody.positionInText >= 0 || isSelected}/>
        </HebTypography.Text>
      </HebPopover>
    </span>
  );
};

export const TeacherForm = ({
                              taskIndex,
                              exerciseIndex,
                              words = [],
                              __t = ExerciseType.SelectMissingWords,
                            }) => {
  const {
    lesson,
    updateExerciseByTaskIndexAndExerciseType
  } = useLessonForm();

  const updateWordByPositionInText = useCallback((positionInText) => (wordBody) => {
    let newWords = merge([], words);
    if (newWords) {
      if (newWords.some(word => word.positionInText === positionInText)) {
        newWords = newWords.map(word => word.positionInText === positionInText
          ? {...wordBody, positionInText: positionInText}
          : {...word});
      } else {
        newWords.push({
          ...wordBody,
          positionInText
        });
      }
    } else {
      newWords = [{...wordBody, positionInText}];
    }
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {words: newWords});
  }, [words, updateExerciseByTaskIndexAndExerciseType, taskIndex, __t]);

  const removeWordFromExercise = useCallback((wordBody) => {
    if (words) {
      const newWords = words.filter(word => word.positionInText !== wordBody.positionInText);
      updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {__t, words: newWords});
    }
  }, [taskIndex, words, updateExerciseByTaskIndexAndExerciseType, __t]);

  const exerciseIsExists = exerciseIndex > -1;
  const taskContents = lesson.tasks[taskIndex].content || [];
  const wordsJoinedIntoText = taskContents.filter(taskContent => taskContent.isVisibleForStudents)
    .map((taskContent: TextContent) => StringUtil.convertHtmlStringToStringArrayWithOutHtml(taskContent?.he_nikkudot || "")
                                                 .map((word) => word === "<br/>" ? <br/> : word))
    .reduce((acc, x) => acc.length ? [...acc, (<br/>), (<br/>), x] : [x], [])
    .flat();
  const wordsBlock = (<HebTypography.Paragraph dir="rtl" className="exercise__select-missing-words__text"
                                               lang="he">
    {
      wordsJoinedIntoText.map((word, index) => {
        const wordBody = words.find(w => w.positionInText === index);
        return (<WordItem word={word as string}
                          wordBody={wordBody}
                          select={updateWordByPositionInText(index)}
                          unselect={removeWordFromExercise}/>)
      })
    }
  </HebTypography.Paragraph>);

  return (
    <>{exerciseIsExists && wordsBlock}</>
  )
}