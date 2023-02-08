import React, { useCallback } from "react";
import { Col, Row, Tag } from "antd";
import { LessonType, UserRole } from "../../../../constants";
import { useAuth } from "../../../../shared/hooks";
import { useTranslation } from "next-i18next";
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { HebForm, HebInputNumber, HebRadio, HebTextArea, HebTypography } from "../../../../components/HebElements";

export const checkAnswerStatus = (isFileAnswer,
                                  points,
                                  isTouched,
                                  reviewBy,
                                  isAutomaticallyChecked,
                                  resultChildren = {
                                    correct: null,
                                    wrong: null,
                                    other: null
                                  }) => {
  const getWrongOrOther = () =>  isTouched ? resultChildren.wrong
    : resultChildren.other;
  const checkOnReview = () => reviewBy ? resultChildren.wrong
    : getWrongOrOther();
  let result = resultChildren.correct;
  if (isFileAnswer) {
    if (points === 0) {
      result = checkOnReview();
    }
  } else {
    if (points === 0) {
      result = isAutomaticallyChecked
        ? resultChildren.wrong
        : checkOnReview();
    }
  }
  return result;
}

export const TagStatus = ({isFileAnswer, answerContent, reviewedBy, isTouched}) => {
  const {t} = useTranslation();
  const getAnswerStatus = useCallback((correct, wrong, other) =>
      checkAnswerStatus(isFileAnswer,
        answerContent?.points,
        isTouched,
        reviewedBy,
        answerContent?.exercise?.isAutomaticallyChecked,
        {correct, wrong, other}),
    [answerContent?.exercise, answerContent?.points, isTouched]);

  const getIsCorrectAnswer = useCallback(() => getAnswerStatus(t("pages.answer.form.answer.correct.label"),
    t("pages.answer.form.answer.incorrect.label"),
    t("pages.answer.form.answer.unchecked.label")),
    [getAnswerStatus, t]);
  return (
    <Tag color={getAnswerStatus("success", "error", "warning")}
         icon={getAnswerStatus(<CheckCircleOutlined />, <CloseCircleOutlined />, <ExclamationCircleOutlined />)} >
      { getIsCorrectAnswer() }
    </Tag>
  )
}

export const Controls = ({
                           role,
                           answerIndex,
                           answerContent,
                           isTouched,
                           setIsTouched,
                           reviewedBy,
                           lessonType,
                           handleTaskAnswerChange,
                           isFileAnswer = false,
                         }) => {
  const {user} = useAuth();
  const {t} = useTranslation();

  const changeIsCorrectSwitch = useCallback((value) => {
    setIsTouched(true);
    handleTaskAnswerChange([{ name: `answers[${answerIndex}].points`, value: value ? 1 : 0 }]);
  }, [setIsTouched, answerIndex, handleTaskAnswerChange]);

  const changeAnswerScore = useCallback((value) => {
    setIsTouched(true);
    handleTaskAnswerChange([{name: `answers[${answerIndex}].points`, value: value}]);
  }, [setIsTouched, answerIndex, handleTaskAnswerChange]);

  const commentFieldLabel = t("pages.answer.form.comment.label");
  const commentFieldPlaceholder = t("pages.answer.form.comment.placeholder");
  return  (
    <Row gutter={[8, 8]}>
      <Col xs={24}>
        <Row>
          <Col xs={24}
               hidden={role !== UserRole.TEACHER} >
            <HebForm.Item name={`answers[${answerIndex}].teacherComment`}
                          initialValue={answerContent?.teacherComment}
                          style={{color: "#000000"}}
                          label={<span style={{color: "#000000 !important"}}>{commentFieldLabel}</span>} >
              <HebTextArea autoSize={{minRows: 4, maxRows: 4}}
                           onChange={() => setIsTouched(true)}
                           disabled={role !== UserRole.TEACHER || (reviewedBy && reviewedBy !== user.userId)}
                           placeholder={commentFieldPlaceholder} />
            </HebForm.Item>
          </Col>
          <Col xs={24}
               hidden={!isFileAnswer && (role !== UserRole.STUDENT || answerContent.teacherComment === undefined)}>
            <Row justify="space-between" gutter={[8, 8]}>
              <Col hidden={role !== UserRole.STUDENT || answerContent.teacherComment === undefined}>
                <HebTypography.Title level={5}
                                     hidden={!answerContent?.teacherComment}>
                  {commentFieldLabel}
                </HebTypography.Title>
              </Col>
              <Col hidden={!isFileAnswer}>
                <TagStatus isTouched={isTouched}
                           reviewedBy={reviewedBy}
                           isFileAnswer={isFileAnswer}
                           answerContent={answerContent}/>
              </Col>
              <Col xs={24} hidden={role !== UserRole.STUDENT || answerContent.teacherComment === undefined}>
                <p>{answerContent?.teacherComment}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col xs={24}>
        <Row justify="end"
             hidden={ lessonType !== LessonType.LESSON || role !== UserRole.TEACHER }>
          <Col hidden={(answerContent?.exercise?.isAutomaticallyChecked)}>
            <Row gutter={8}
                 align="middle">
              <Col>
                <HebRadio.Group optionType="button"
                                buttonStyle="solid"
                                value={ isTouched ? answerContent.points > 0
                                        : reviewedBy ? answerContent.points > 0
                                                     : "" }
                                disabled={(reviewedBy && reviewedBy !== user.userId)}>
                  <HebRadio.Button onClick={() => changeIsCorrectSwitch(false)}>
                    <span style={{color: "#000000"}}>
                      {t("pages.answer.form.answer.incorrect.label")}
                    </span>
                  </HebRadio.Button>
                  <HebRadio.Button onClick={() => changeIsCorrectSwitch(true)}>
                    <span style={{color: "#000000"}}>
                      {t("pages.answer.form.answer.correct.label")}
                    </span>
                  </HebRadio.Button>
                </HebRadio.Group>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col xs={24}>
        <Row hidden={ lessonType !== LessonType.EXAM || role === UserRole.STUDENT }
             align="middle"
             justify="space-between"
             gutter={[8, 8]} >
          <Col {...isFileAnswer && ({xs: 6})}>
            <HebTypography.Title level={5}>{t("pages.answer.rating")}</HebTypography.Title>
          </Col>
          <Col {...isFileAnswer && ({xs: 16})}>
            <HebInputNumber min={0}
                            style={{width: "100%"}}
                            disabled={(reviewedBy && reviewedBy !== user.userId)}
                            onChange={changeAnswerScore}
                            value={answerContent?.points || 0} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}