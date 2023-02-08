import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import AnswersPage from "../../../scenes/Answers/components/AnswersPage";
import { UserRole } from "../../../constants";
import { StudentTasksAnswersListProvider } from "../../../providers";
import { withMainLayout } from "../../../hocs";
import { GetServerSideProps } from "next";

export const AnswersListPage = () => {
  return (
    <StudentTasksAnswersListProvider role={UserRole.STUDENT}>
      <AnswersPage role={UserRole.STUDENT}/>
    </StudentTasksAnswersListProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(AnswersListPage);