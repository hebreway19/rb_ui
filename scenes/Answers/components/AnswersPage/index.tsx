import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useLessonsService } from "../../../../services";
import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/router";
import { Lesson } from "../../../../types";
import { UserRole } from "../../../../constants";
import { AnswersExtra } from "../AnswersExtra";
import { AnswersList } from "../AnswersList";

export const AnswersPage = ({role}) => {
  const {t} = useTranslation();
  const router = useRouter();
  const query = router.query;
  const [lesson, setLesson] = useState<Lesson>({} as Lesson);
  const lessonsService = useLessonsService();

  useEffect(() => {
    const loadData = async (lessonId) => {
      try {
        const foundLesson = await lessonsService.loadLessonById(lessonId);
        setLesson(foundLesson);
      } catch (error) {
        console.error(error);
        message.warn(error.message);
      }
    }
    query["lesson"] && loadData(query["lesson"]);
  }, [lessonsService, query]);

  const pageHeaderTitle = t("navs.task_answers");


  const isMobile = useMediaQuery({query: "(max-width: 768px)"});

  return (
    <div className="page-answers__container">
      { !isMobile &&
        <div className="page-answers__header">
          <Row justify="space-between" align="middle" gutter={16}>
            <Col xs={24} xl={12}>
              <h3 style={{direction: "rtl", margin: 0}}>{pageHeaderTitle} {lesson?.title?.he_nikkudot || lesson?.title?.he || ""}</h3>
            </Col>
            <Col xs={24} xl={12}>
              <AnswersExtra isStudent={role === UserRole.STUDENT} />
            </Col>
          </Row>
        </div>
      }
      <AnswersList role={role} />
    </div>
  )
}

export default AnswersPage;