import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

import { LessonCalendar } from "../../../scenes/Lessons/components";
import { withMainLayout } from "../../../hocs";

export const LessonTimeTablePage = () => {
  return (<LessonCalendar/>);
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(LessonTimeTablePage);