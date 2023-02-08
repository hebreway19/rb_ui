import { Spin } from "antd";
import dynamic from "next/dynamic";
import React from "react";
import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { withMainLayout } from "../../../../hocs";
import { LessonFormProvider, StudentTasksAnswersFormProvider } from "../../../../providers";

const  LessonPage = dynamic(() => import( "../../../../components/LessonPage"), {loading: () => <Spin/>, ssr: false});


const StudentLessonPage = ({lessonId}) => {
  return (
    <LessonFormProvider isAutomaticallyDownloaded={false} lessonId={lessonId}>
      <StudentTasksAnswersFormProvider lessonId={lessonId}>
        <LessonPage/>
      </StudentTasksAnswersFormProvider>
    </LessonFormProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale, params}) => {
  const {lessonId} = params;
  return {
    props: {
      lessonId,
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(StudentLessonPage);