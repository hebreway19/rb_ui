import React, { useCallback } from "react";
import { Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import nl2br from "react-nl2br";
import PropTypes, { InferProps } from "prop-types";

import { HebButton, HebTooltip } from "../../../../components/HebElements";
import { RoutePath } from "../../../../constants";
import { useStudentTasksAnswersAnswerList } from "../../../../providers";

const {TEACHER, STUDENT, STUDENT_TASKS_ANSWERS_PATH} = RoutePath;

export const AnswersExtra = ({isStudent}: InferProps<typeof AnswersExtra.propTypes>) => {
  const {setFilteredInfo, loadStudentTaskAnswersByQueryAndPagination, studentTasksAnswersPage} = useStudentTasksAnswersAnswerList();
  const router = useRouter();
  const query = router.query;
  const {t} = useTranslation();

  const clearFilter = useCallback(async () => {
    query["lesson"] && await router.push(STUDENT_TASKS_ANSWERS_PATH(isStudent ? STUDENT() : TEACHER()));
    await loadStudentTaskAnswersByQueryAndPagination({}, {page: studentTasksAnswersPage.page, limit: 8});
    setFilteredInfo(null);
  }, [query, setFilteredInfo]);

  const clearFilterButtonLabel: string = t(`pages.answers.filter.buttons.clear_filter.label`);
  const clearFilterButtonTooltip: string = t("tooltips.press_to_action", {action: clearFilterButtonLabel.toLowerCase()});

  const isTablet = useMediaQuery({query: "(max-width: 1200px)"});

  return (
    <Row
      justify="end"
      style={{maxWidth: isTablet ? "100%" : 400, width: "100%"}}>
      <Col xs={24} style={{textAlign: "right"}}>
        <HebTooltip placement="bottom"
                    title={nl2br(clearFilterButtonTooltip)}>
          <HebButton className="page-answers__extra__button"
                     style={{maxWidth: isTablet ? "100%" : 275, width: "100%"}}
                     onClick={clearFilter}>{clearFilterButtonLabel}</HebButton>
        </HebTooltip>
      </Col>
    </Row>
  );
}

AnswersExtra.propTypes = {
  isStudent: PropTypes.bool
}
AnswersExtra.defaultProps = {
  isStudent: false
};