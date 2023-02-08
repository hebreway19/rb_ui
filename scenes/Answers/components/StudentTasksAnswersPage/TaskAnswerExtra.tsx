import { EyeInvisibleOutlined, EyeOutlined, SaveOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import nl2br from "react-nl2br";
import { UserRole } from "../../../../constants";
import { useAuth } from "../../../../shared/hooks";
import { HebButton, HebTooltip } from "../../../../components/HebElements";
import { useMediaQuery } from "react-responsive";
import { useStudentTasksAnswersForm } from "../../../../providers";
import { SendStudentTasksAnswersByEmail } from "./SendStudentTasksAnswersByEmail";

export const TaskAnswerExtra = ({role, ...props}) => {
  const {
    saveStudentTasksAnswers,
    studentTasksAnswers,
    formState,
    setFormState,
    getStudentTaskAnswerFormFieldTooltip,
    restartStudentTaskAnswer,
    downloadStudentTasksAnswersPdf
  } = useStudentTasksAnswersForm();
  const {user} = useAuth()
  const {t} = useTranslation();


  const showWithoutNikkudotTooltip = getStudentTaskAnswerFormFieldTooltip("showWithoutNikkudot");
  const showOrHideTranslationLabel = !formState.isVisibleTranslate
    ? t("actions.show.entity", {entity: t("entities.translation.translation").toLowerCase()})
    : t("actions.hide.entity", {entity: t("entities.translation.translation").toLowerCase()});
  const showOrHideTranslationTooltip = t("tooltips.press_to_action", {action: showOrHideTranslationLabel.toLowerCase()});
  const finishCheckingAnswersLabel = t("pages.answer.form.actions.save_answer.label");
  const finishCheckingAnswersTooltips = t("tooltips.press_to_action", {action: finishCheckingAnswersLabel.toLowerCase()});
  const showTextButtonLabel = !formState.textIsVisible
                              ? t("actions.show.entity", {entity: t("entities.text").toLowerCase()})
                              : t("actions.hide.entity", {entity: t("entities.text").toLowerCase()});
  const showTextButtonTooltip = t("tooltips.press_to_action", {action: showTextButtonLabel.toLowerCase()});

  const restartStudentTaskAnswerLabel = t("pages.answer.form.actions.restart.label");
  const restartStudentTaskAnswerTooltip = t("tooltips.press_to_action", {action: restartStudentTaskAnswerLabel.toLowerCase()});

  const downloadPdfStudentTaskAnswerLabel = t("pages.answer.form.actions.download_pdf.label");
  const downloadPdfStudentTaskAnswerTooltip = t("tooltips.press_to_action", {action: downloadPdfStudentTaskAnswerLabel.toLowerCase()});

  const isLaptop = useMediaQuery({query: "(max-width: 1510px)"});

  return (
    <Row gutter={[8, 8]}>
      <Col hidden={role === UserRole.STUDENT && !formState.textIsVisible} {...isLaptop && ({xs: 4})}>
        <HebTooltip title={showWithoutNikkudotTooltip}>
          <HebButton viewType={formState.showWithoutNikkudot ? "primary-v2" : "primary"}
                     buttonSize="over-small"
                     overText={false}
                     {...isLaptop && ({block: true})}
                     onClick={() => setFormState(oldState => ({...oldState,
                                                               showWithoutNikkudot: !oldState.showWithoutNikkudot}))}>
            {formState.showWithoutNikkudot ? "א" : "אָ"}
          </HebButton>
        </HebTooltip>
      </Col>
      <Col hidden={role !== UserRole.STUDENT && formState.textIsVisible}
           {...isLaptop && ({xs: 20})}>
        <HebTooltip placement="bottom" title={downloadPdfStudentTaskAnswerTooltip}>
          <HebButton overText={false} buttonSize="over-small" onClick={downloadStudentTasksAnswersPdf}>
            {downloadPdfStudentTaskAnswerLabel}
          </HebButton>
        </HebTooltip>
      </Col>
      <Col hidden={role !== UserRole.TEACHER} {...isLaptop && ({xs: 20})}>
        <SendStudentTasksAnswersByEmail/>
      </Col>
      <Col hidden={role !== UserRole.STUDENT && formState.textIsVisible}
           {...isLaptop && ({xs: 20})}>
        <HebTooltip placement="bottom" title={restartStudentTaskAnswerTooltip}>
          <HebButton overText={false} buttonSize="over-small" onClick={restartStudentTaskAnswer}>
            {restartStudentTaskAnswerLabel}
          </HebButton>
        </HebTooltip>
      </Col>
      <Col hidden={role === UserRole.STUDENT && !formState.textIsVisible}
           {...isLaptop && ({xs: 20})}>
        <HebTooltip placement="bottom"
                    title={showOrHideTranslationTooltip}>
          <HebButton onClick={() => setFormState(oldState => ({...oldState,
                                                               isVisibleTranslate: !oldState.isVisibleTranslate}))}
                     icon={formState.isVisibleTranslate
                       ? <EyeInvisibleOutlined />
                       : <EyeOutlined />}
                     overText={isLaptop}
                     {...isLaptop && ({block: true})}
                     buttonSize="over-small">
            {showOrHideTranslationLabel}
          </HebButton>
        </HebTooltip>
      </Col>
      <Col hidden={role !== UserRole.STUDENT} {...isLaptop && ({xs: 20})}>
        <HebTooltip placement="bottomRight"
                    title={showTextButtonTooltip}>
          <HebButton viewType={formState.textIsVisible ? "primary-v2" : "primary"}
                     buttonSize="over-small"
                     overText={isLaptop}
                     {...isLaptop && ({block: true})}
                     onClick={() => setFormState(oldState => ({...oldState, textIsVisible: !oldState.textIsVisible}))}
                     icon={formState.textIsVisible ? <EyeInvisibleOutlined/> : <EyeOutlined/>}>
            {nl2br(showTextButtonLabel)}
          </HebButton>
        </HebTooltip>
      </Col>
      <Col hidden={role !== UserRole.TEACHER} {...isLaptop && ({xs: 24})}>
        <HebTooltip placement="bottomRight" title={nl2br(finishCheckingAnswersTooltips)}>
          <HebButton onClick={saveStudentTasksAnswers}
                     overText={isLaptop}
                     {...isLaptop && ({block: true})}
                     buttonSize="over-small"
                     disabled={studentTasksAnswers.reviewedBy && studentTasksAnswers.reviewedBy !== user.userId}
                     icon={<SaveOutlined/>}>
            {finishCheckingAnswersLabel}
          </HebButton>
        </HebTooltip>
      </Col>
    </Row>
  );
}