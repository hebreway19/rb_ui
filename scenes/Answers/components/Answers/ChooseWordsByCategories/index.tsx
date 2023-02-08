import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Badge, Col, Divider, Row } from "antd";
import { UserRole } from "../../../../../constants";
import { HebTypography } from "../../../../../components/HebElements";
import nl2br from "react-nl2br";
import { CategorySelector } from "./CategorySelector";
import { getWordsWithBr, setCategory } from "./utils";
import { WordComponent } from "..";
import { useAuth } from "../../../../../providers/AuthProvider";

const colors = {
  wrong: "#ffe58fa3",
  correct: "rgba(63,180,58,0.56)",
  teacher: "rgba(119,106,193,0.73)",
  inherit: "inherit"
}

export const ChooseWordsByCategoriesForm = ({
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
      <HebTypography.Paragraph style={{textAlign: "justify"}}>
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
            if (teacherCategoryName === currentCategoryName) {
              style.backgroundColor = colors.teacher;
            }
            if (!!teacherCategoryName && studentCategoryName === teacherCategoryName && studentCategoryName === currentCategoryName) {
              style.backgroundColor = colors.correct;
            }
            return (<WordComponent word={word}
                                   key={index}
                                   style={style}/>);
          })
        }
      </HebTypography.Paragraph>
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
            <HebTypography.Title level={4}>
              {categoryTitle}
            </HebTypography.Title>
          </Divider>
        </Col>
        <Col xs={24}>
          {categorySelect}
        </Col>
        <Col xs={24}>
          <Divider orientation={"left"}>
            <HebTypography.Title level={4}>
              {nl2br(mainTextTitle)}
            </HebTypography.Title>
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