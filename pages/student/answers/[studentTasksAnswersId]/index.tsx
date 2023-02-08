import { Spin } from "antd";
import dynamic from "next/dynamic";
import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { withMainLayout } from "../../../../hocs";
import { StudentTasksAnswersFormProvider } from "../../../../providers";
import { UserRole } from "../../../../constants";

const StudentTasksAnswersPage = dynamic(() => import("../../../../scenes/Answers/components/StudentTasksAnswersPage"), {loading: () => <Spin/>, ssr: false});


export const AnswerPage = ({studentTasksAnswersId}) => {
  return (
    <StudentTasksAnswersFormProvider studentTasksAnswersId={studentTasksAnswersId}>
      <StudentTasksAnswersPage role={UserRole.STUDENT}/>
    </StudentTasksAnswersFormProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({locale, params}) => {
  const {studentTasksAnswersId} = params;
  return {
    props: {
      studentTasksAnswersId,
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(AnswerPage);