import { useTranslation } from "next-i18next";
import React from "react";
import { Col, Row } from "antd";
import { CardList } from "./CardList";

export const MemoryForm = ({answer, sets}) => {
  const {t} = useTranslation();
  
  const guessedSetsLabel: string = t('pages.answers.exercises.memory.guessed_sets');
  const notGuessedSetsLabel: string = t('pages.answers.exercises.memory.not_guessed_sets');

  const writtenTextTitle: string = t("pages.lesson.form.tasks.exercises.writtenText.title")
  
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24}>
        { guessedSetsLabel }
      </Col>
      { sets.filter((set) => answer.guessedSets.includes(set?._id))
            .map((set, index) => (
              <Col xs={24} key={index}>
                <Row gutter={[8, 8]}>
                  <Col xs={24}>
                    <h3 lang="he">{set.title}</h3>
                  </Col>
                  <Col xs={24}>
                    <CardList cardList={set.cards} />
                  </Col>
                </Row>
              </Col>
            )) }
      <Col xs={24} hidden={ sets.filter((set) => !(answer.guessedSets.includes(set?._id))).length === 0 }>
        { notGuessedSetsLabel }
      </Col>
      { sets.filter((set) => !answer.guessedSets.includes(set?._id))
            .map((set, index) => (
              <Col xs={24} key={index}>
                <Row gutter={[8, 8]}>
                  <Col xs={24}>
                    <h3 lang="he">{set.title}</h3>
                  </Col>
                  <Col xs={24}>
                    <CardList cardList={set.cards} isWrong={true} />
                  </Col>
                </Row>
              </Col>
            )) }
      <Col xs={24} hidden={ Object.values(answer.writtenText).length === 0 }>
        { writtenTextTitle }
      </Col>
      { Object.values(answer.writtenText).map((value, index) => (
        <Col xs={24} key={index}>
          <Row>
            <Col xs={24}>
              <h3 lang="he" dir="rtl">{sets[index]?.title}</h3>
            </Col>
            <Col xs={24}>
              <p lang="he" dir="rtl">{value}</p>
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  )
}