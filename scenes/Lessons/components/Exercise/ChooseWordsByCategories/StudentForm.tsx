import React, { useCallback, useEffect, useState } from "react";
import { Badge, Col, Divider, Row, Space, Typography } from "antd";
import { StringUtil } from "../../../../../util";
import { StudentAnswerType, UserRole } from "../../../../../constants";
import { StudentWordItem } from "./StudentWordItem";
import { assign, merge } from "lodash";
import { useTranslation } from "next-i18next";
import { WordComponent } from "../WordComponent";
import { useAuth } from "../../../../../shared/hooks";
import { HebSelect } from "../../../../../components/HebElements";
import nl2br from "react-nl2br";

const setCategory = (categories) => {
  if (Object.keys(categories)) {
    return Object.keys(categories)[0]
  }
  return ""
}

const CategorySelector = ({ currentValue, categories, setCurrentValue }) => {
  const categoryOptions = categories.map((categoryName) => (
    <HebSelect.Option key={categoryName} value={categoryName}>
      {categoryName}
    </HebSelect.Option>));
  return (<HebSelect onChange={setCurrentValue}
                     arrow={false}
                     type="primary"
                     value={currentValue}
                     dir="rtl"
                     lang="he"
                     style={{width: "100%"}}>{categoryOptions}</HebSelect>)
}

const getWordsWithBr = (paragraphs) => {
  return paragraphs.map((taskContent) => StringUtil.convertHtmlStringToStringArrayWithOutHtml(taskContent?.he_nikkudot || ""))
                   .reduce((acc, x) => acc.length ? [...acc, (<br/>), (<br/>), x] : [x], [])
                   .flat()
                   .map(word => word === "<br/>" ? <br/> : word);
}

const EditForm = ({
                    _id,
                    __t = StudentAnswerType.ChooseWordsByCategories,
                    task = {content: []},
                    wordsByCategories = {},
                    setAnswer,
                    answer = {wordsByCategories: {}}
}) => {
  const [currentCategoryName, setCurrentCategoryName] = useState("");

  const addWordToCategory = useCallback((wordIndexInText, categoryName = "") => () => {
    if (categoryName) {
      const category = {
        ...answer?.wordsByCategories?.[categoryName]
           ? answer.wordsByCategories[categoryName]
           : {words: []}
      }
      if (!category?.words.includes(wordIndexInText)) {
        category.words.push(wordIndexInText);
        setAnswer(merge({}, answer, {
          __t: StudentAnswerType.ChooseWordsByCategories,
          wordsByCategories: {[categoryName]: category}
        }));
      }
    }
  }, [wordsByCategories, answer, setAnswer]);

  const removeWordFromCategory = useCallback((wordIndexInText, categoryName) => () =>
    setAnswer(oldAnswer => {
      const category = merge(oldAnswer.wordsByCategories[categoryName], {words: []});
      category.words = category.words.filter(wordIndex => wordIndex !== wordIndexInText);
      return assign({},
        answer,
        {
          __t: StudentAnswerType.ChooseWordsByCategories,
          wordsByCategories: assign(answer.wordsByCategories, {[categoryName]: category})
        });
    }), [wordsByCategories, answer, setAnswer]);

  const moveWordToCurrentCategory = useCallback((wordInTextIndex, sourceCategoryName, targetCategoryName) => () =>
    setAnswer(oldAnswer => {
      const sourceCategory = merge({}, oldAnswer.wordsByCategories[sourceCategoryName], {words: []});
      const targetCategory = merge({}, oldAnswer.wordsByCategories[targetCategoryName], {words: []});
      sourceCategory.words = sourceCategory.words.filter(wordIndex => wordIndex !== wordInTextIndex);
      if (!targetCategory.words.some(wordIndex => wordIndex === wordInTextIndex)) {
        targetCategory.words.push(wordInTextIndex);
      }
      return assign({},
                    oldAnswer,
                    {
                      __t: StudentAnswerType.ChooseWordsByCategories,
                      wordsByCategories: assign(oldAnswer.wordsByCategories,
                                                {
                                                  [sourceCategoryName]: sourceCategory,
                                                  [targetCategoryName]: targetCategory
                                                })
                    })
    }), [setAnswer]);

  const categorySelector = (<CategorySelector currentValue={currentCategoryName}
                                              setCurrentValue={setCurrentCategoryName}
                                              categories={Object.keys(wordsByCategories)}/>);

  const wordsComponents = getWordsWithBr(task.content.filter(taskContent => taskContent.isVisibleForStudents));
  const wordsBlock = (
    <div dir="rtl" lang="he">
      <Typography.Paragraph style={{textAlign: "right"}}>
        {
          wordsComponents.map((word, index) => {
            const categoryName = Object.keys(answer?.wordsByCategories || {})
                                       .find(categoryNameValue => (
                                         answer.wordsByCategories[categoryNameValue] &&
                                         answer.wordsByCategories[categoryNameValue].words.includes(index))
                                       );
            return (<StudentWordItem word={word}
                                     key={index}
                                     categoryName={categoryName}
                                     currentCategoryName={currentCategoryName}
                                     onClick={currentCategoryName === categoryName
                                              ? removeWordFromCategory(index, currentCategoryName)
                                              : categoryName
                                                ? moveWordToCurrentCategory(index, categoryName, currentCategoryName)
                                                : addWordToCategory(index, currentCategoryName)
                                     }/>);
          })
        }
      </Typography.Paragraph>
    </div>
  );

  useEffect(() => {
    setCurrentCategoryName(setCategory(wordsByCategories));
  }, [wordsByCategories, setCurrentCategoryName]);

  return (
    <>
      <Space direction="vertical"
             style={{width: "100%"}}>
        <Row gutter={8}>
          <Col xs={20}>
            {categorySelector}
          </Col>
        </Row>
        <Divider/>
        <Row>
          <Col xs={24}>
            {wordsBlock}
          </Col>
        </Row>
      </Space>
    </>
  );
}

const colors = {
  wrong: "#ffe58fa3",
  correct: "rgba(63,180,58,0.56)",
  teacher: "rgba(119,106,193,0.73)",
  inherit: "inherit"
}

const ViewForm = ({
                    task = {content: []},
                    wordsByCategories = {},
                    answer = {wordsByCategories: []}
}) => {
  const {user} = useAuth();
  const {t} = useTranslation();
  const [currentCategoryName, setCurrentCategoryName] = useState("");
  const categorySelect = <CategorySelector currentValue={currentCategoryName}
                                           setCurrentValue={setCurrentCategoryName}
                                           categories={Object.keys(wordsByCategories)} />;
  const wordComponents = getWordsWithBr(task.content.filter(contentItem => contentItem.isVisibleForStudents));

  const wordsBlock = (
    <div dir="rtl" lang="he">
      <Typography.Paragraph style={{textAlign: "justify"}}>
        {
          wordComponents.map((word, index) => {
            const studentCategoryName = Object.keys(answer?.wordsByCategories || {})
                                              .find(categoryNameValue => (
                                                answer.wordsByCategories[categoryNameValue]
                                                && answer.wordsByCategories[categoryNameValue].words.includes(index))
                                              );
            const teacherCategoryName = Object.keys(wordsByCategories)
                                              .find(categoryName => wordsByCategories[categoryName].words.includes(index));
            const style: React.CSSProperties = {};
            if (studentCategoryName === currentCategoryName) {
              style.backgroundColor = colors.wrong;
            }
            if (teacherCategoryName === currentCategoryName && user.role !== UserRole.STUDENT) {
              style.backgroundColor = colors.teacher;
            }
            if (!!teacherCategoryName && studentCategoryName === teacherCategoryName && studentCategoryName === currentCategoryName) {
              style.backgroundColor = colors.correct;
            }
            return (<WordComponent role={UserRole.TEACHER}
                                   word={word}
                                   key={index}
                                   style={style}/>);
          })
        }
      </Typography.Paragraph>
    </div>
  );

  useEffect(() => {
    setCurrentCategoryName(setCategory(wordsByCategories));
  }, [wordsByCategories, setCurrentCategoryName]);

  const pathToTranslate = "pages.lesson.form.tasks.exercises"
  const categoryTitle = t(`${pathToTranslate}.categories.select.category`);
  const mainTextTitle = t(`${pathToTranslate}.categories.selected.word`, {category: currentCategoryName});
  const teacherColorLabel = t(`${pathToTranslate}.choiceVariables.teacher`);
  const correctColorLabel = t(`${pathToTranslate}.choiceVariables.student.correct.for_${user.role}`);
  const wrongColorLabel = t(`${pathToTranslate}.choiceVariables.student.incorrect.for_${user.role}`);

  return (
    <>
      <Row gutter={[8, 8]}>
        <Col xs={24}>
          <Divider orientation={"left"}>
            <Typography.Title level={4}>
              {categoryTitle}
            </Typography.Title>
          </Divider>
        </Col>
        <Col xs={24}>
          {categorySelect}
        </Col>
        <Col xs={24}>
          <Divider orientation={"left"}>
            <Typography.Title level={4}>
              {nl2br(mainTextTitle)}
            </Typography.Title>
          </Divider>
        </Col>
        <Col xs={24}>
          <Row justify={"space-between"} gutter={[8, 8]}>
            <Col hidden={user?.role === UserRole.STUDENT}>
              <Badge color={colors.teacher} text={teacherColorLabel}/>
            </Col>
            <Col>
              <Badge color={colors.correct} text={correctColorLabel}/>
            </Col>
            <Col>
              <Badge color={colors.wrong} text={wrongColorLabel}/>
            </Col>
          </Row>
        </Col>
        <Col xs={24}>
          {wordsBlock}
        </Col>
      </Row>
    </>
  )
}

export const StudentForm = ({
                              mode,
                              ...props
                            }) => {
  return mode === "view" ? <ViewForm {...props} />
                         : <EditForm {...props as any} />;
};