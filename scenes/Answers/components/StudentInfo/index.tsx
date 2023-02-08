import { Col, Row, Typography } from "antd";
import moment from "moment";
import React from "react";
import { useTranslation } from "next-i18next";
import { UserRole } from "../../../../constants";

export const StudentInfo = ({student, role, lesson, isReviewed, ...props}) => {
  const {t} = useTranslation();
  const reviewedLabel = t("pages.answers.table.is_checked.checked.tooltip");
  return (
    <Row gutter={[8, 8]} align="middle" >
      <Col>
        <Typography.Title level={4}
                          style={{margin: 0}} >
          {role === UserRole.TEACHER && `${student?.firstname || ""} ${student?.surname || ""}`}
          {role === UserRole.STUDENT && `${lesson?.title?.he_nikkudot || ""} ${moment(lesson?.openFrom).format(t("date_format")) || ""}` }
        </Typography.Title>
      </Col>
      {isReviewed && <Col>({reviewedLabel})</Col>}
    </Row>
  )
}