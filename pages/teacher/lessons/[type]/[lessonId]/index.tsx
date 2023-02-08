import { Spin } from "antd";
import dynamic from "next/dynamic";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

import { LessonFormProvider, StudentTasksAnswersFormProvider } from "../../../../../providers";
import { withMainLayout } from "../../../../../hocs";

const  LessonForm = dynamic(() => import( "../../../../../scenes/Lessons/components/LessonForm"), {loading: () => <Spin/>, ssr: false});

const LessonEditPage = ({type, lessonId}) => {
  return (
    <LessonFormProvider lessonId={lessonId} type={type}>
      <StudentTasksAnswersFormProvider lessonId={lessonId}>
        <LessonForm/>
      </StudentTasksAnswersFormProvider>
    </LessonFormProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale, params}) => {
  const {type, lessonId} = params;
  return {
    props: {
      type,
      lessonId,
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(LessonEditPage);