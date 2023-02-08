import React, { useCallback, useEffect, useState } from "react";
import { Col, Divider, Row, Select, Space } from "antd";
import { EditOutlined } from "@ant-design/icons";
import nl2br from "react-nl2br";
import { ExerciseType } from "../../../../../constants";
import { useTranslation } from "next-i18next";
import { StringUtil } from "../../../../../util";
import { TeacherWordItem } from "./TeacherWordItem";
import { TeacherAddCategoryButton } from "./TeacherAddCategoryButton";
import { TeacherEditCategory } from "./TeacherEditCategory";
import { HebButton, HebSelect, HebTooltip, HebTypography } from "../../../../../components/HebElements";


export const TeacherForm = ({
                              taskIndex,
                              exerciseIndex,
                              __t = ExerciseType.ChooseWordsByCategories,
                              updateExerciseByTaskIndexAndExerciseType,
                              task = {content: []},
                              wordsByCategories = {},
                              createOrRemoveExerciseByTaskIndexAndExerciseIndexAndExerciseType,
                              _id
                            }) => {
  const {t} = useTranslation();
  const [currentCategoryName, setCurrentCategoryName] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const exerciseType = t(`pages.lesson.form.tasks.exercises.types.${__t}.title`);

  const addCategory = useCallback((categoryName, color) => {
    if (!wordsByCategories[categoryName]) {
      const newWordsByCategories = {...wordsByCategories, [categoryName]: {color, words: []}}
      updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {wordsByCategories: newWordsByCategories});
      setCurrentCategoryName(categoryName);
    }
  }, [taskIndex, __t, updateExerciseByTaskIndexAndExerciseType, wordsByCategories]);

  const removeCategory = useCallback((removedCategoryName) => () => {
    const newWordsByCategories = {};
    Object.keys(wordsByCategories)
          .filter(categoryName => categoryName !== removedCategoryName)
          .forEach(categoryName => newWordsByCategories[categoryName] = wordsByCategories[categoryName]);
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {wordsByCategories: newWordsByCategories});
    if (removedCategoryName === currentCategoryName) {
      setCurrentCategoryName(Object.keys(newWordsByCategories)[0] || "");
    }
  }, [taskIndex, __t, updateExerciseByTaskIndexAndExerciseType, wordsByCategories, currentCategoryName]);

  const renameCategory = useCallback((oldCategoryName) => (newCategoryName) => {
    const newWordsByCategories = {...wordsByCategories};
    const oldCategory = newWordsByCategories[oldCategoryName];
    newWordsByCategories[newCategoryName] = oldCategory;
    delete newWordsByCategories[oldCategoryName];
    updateExerciseByTaskIndexAndExerciseType(taskIndex, __t, {wordsByCategories: newWordsByCategories});
    setCurrentCategoryName(newCategoryName);
  }, [taskIndex, __t, updateExerciseByTaskIndexAndExerciseType, wordsByCategories, removeCategory]);

  const addWordToCategory = useCallback((wordIndexInText, categoryName = "") => () => {
    if (categoryName) {
      const category = wordsByCategories[categoryName];
      if (!category.words.includes(wordIndexInText)) {
        const newWords = [...category.words];
        newWords.push(wordIndexInText);
        updateExerciseByTaskIndexAndExerciseType(taskIndex,
                                                 __t,
                                                 {
                                                   wordsByCategories: {
                                                     ...wordsByCategories,
                                                     [categoryName]: {...category, words: newWords}
                                                   }
                                                 });
      }
    }
  }, [taskIndex, __t, updateExerciseByTaskIndexAndExerciseType, wordsByCategories]);

  const removeWordFromCategory = useCallback((wordIndexInText, categoryName) => () => {
    const category = wordsByCategories[categoryName];
    category.words = category.words.filter(wordIndex => wordIndex !== wordIndexInText);
    updateExerciseByTaskIndexAndExerciseType(taskIndex,
                                             __t,
                                             {
                                               wordsByCategories: {
                                                 ...wordsByCategories,
                                                 [categoryName]: {...category}
                                               }
                                             });
  }, [taskIndex, __t, updateExerciseByTaskIndexAndExerciseType, wordsByCategories]);

  const moveWordToCurrentCategory = useCallback((wordInTextIndex, sourceCategoryName) => () => {
    removeWordFromCategory(wordInTextIndex, sourceCategoryName);
    addWordToCategory(wordInTextIndex, currentCategoryName);
  }, [taskIndex, __t, updateExerciseByTaskIndexAndExerciseType, wordsByCategories, currentCategoryName]);

  const editCategoryTooltip = t("tooltips.press_to_action",
    { action: t("actions.edit",
        { entity: t("entities.category.case.accusative") }
      ).toLowerCase()});
  const selectCategoryLabel = Object.keys(wordsByCategories).length > 0
                              ? t("placeholders.entity.select.select", { entity: t("entities.category.case.accusative").toLowerCase() })
                              : t("placeholders.entity.select.add", { entity: t("entities.category.case.accusative").toLowerCase() });

  const categorySelectorOptions = Object.keys(wordsByCategories)
                                        .map((categoryName, categoryIndex) => (
                                          <Select.Option
                                            dir="rtl"
                                            key={categoryIndex}
                                            value={categoryName}
                                          >{categoryName}</Select.Option>
                                        ));
  const categorySelector = (
    <HebSelect
      className="exercise__choose-words-by-categories__selector"
      onChange={setCurrentCategoryName}
      value={currentCategoryName}
      arrow={false}
      dir="rtl"
      style={{width: "100%"}}
    >
      {currentCategoryName === "" && <Select.Option value={""}>{nl2br(selectCategoryLabel)}</Select.Option>}
      {categorySelectorOptions}
    </HebSelect>
  );

  useEffect(() => {
    setCurrentCategoryName(oldState => Object.keys(wordsByCategories).length === 0 ? "" : oldState);
  }, [wordsByCategories]);

  const wordsComponents = task.content.filter(taskContent => taskContent.isVisibleForStudents)
                              .map((taskContent) => StringUtil.convertHtmlStringToStringArrayWithOutHtml(taskContent?.he_nikkudot || ""))
                              .reduce((acc, x) => acc.length ? [...acc, (<br/>), (<br/>), x] : [x], [])
                              .flat();
  const wordsBlock = (<HebTypography.Paragraph dir="rtl"
                                            style={{textAlign: "justify"}}
                                            lang="he">
    {
      wordsComponents.map((word, index) => {
        const categoryName = Object.keys(wordsByCategories)
                                   .find(categoryName => wordsByCategories[categoryName].words.includes(index));
        const isSelected = categoryName === currentCategoryName;
        return (<TeacherWordItem word={word}
                                 key={index}
                                 categoryName={categoryName}
                                 currentCategoryName={currentCategoryName}
                                 style={{color: "#ffffff"}}
                                 onClick={isSelected
                                   ? categoryName
                                     ? removeWordFromCategory(index, categoryName)
                                     : moveWordToCurrentCategory(index, categoryName)
                                   : addWordToCategory(index, currentCategoryName)}/>);
      })
    }
  </HebTypography.Paragraph>);

  return (
    <>
      <Space direction="vertical"
             style={{width: "100%"}}>
        <Row gutter={[8, 8]}
             hidden={exerciseIndex < 0}>
          <Col xs={24}>
            <Row hidden={isEdit} gutter={8}>
              <Col xs={3}>
                <HebTooltip placement="topLeft"
                         title={nl2br(editCategoryTooltip)}>
                  <HebButton icon={<EditOutlined />}
                             buttonSize="small"
                             className="exercise__choose-words-by-categories__edit-category"
                             disabled={currentCategoryName === ""}
                             viewType={isEdit ? "primary" : "default"}
                             onClick={() => setIsEdit(oldState => !oldState)} block />
                </HebTooltip>
              </Col>
              <Col xs={18}>
                {categorySelector}
              </Col>
              <Col xs={3}>
                <TeacherAddCategoryButton addCategory={addCategory} />
              </Col>
            </Row>
          </Col>
          <Col xs={24}>
            <Row hidden={!isEdit}>
              <Col xs={24}>
                <TeacherEditCategory currentCategoryName={currentCategoryName}
                                     wordsByCategories={wordsByCategories}
                                     onClose={() => setIsEdit(false)}
                                     onRemove={removeCategory(currentCategoryName)}
                                     onRename={renameCategory(currentCategoryName)} />
              </Col>
            </Row>
            <Divider/>
          </Col>
          <Col xs={24} className="exercise__choose-words-by-categories__text">
            {wordsBlock}
          </Col>
        </Row>
      </Space>
    </>
  );
};
