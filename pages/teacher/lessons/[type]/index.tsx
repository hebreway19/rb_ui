import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";

import { withMainLayout } from "../../../../hocs";
import { LessonsList } from "../../../../components/LessonsList";

const LessonsListPage = ({type}) => {
  return (<LessonsList type={type}/>);
};

export const getServerSideProps: GetServerSideProps = async ({locale, params}) => {
  const {type} = params;
  return {
    props: {
      type,
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(LessonsListPage);