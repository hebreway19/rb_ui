import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FootnotesTable } from "../../../../scenes/Footnotes/components";
import { FootnoteListProvider } from "../../../../providers";
import { withMainLayout } from "../../../../hocs";
import { GetServerSideProps } from "next";

export const FootnoteList = () => {
  return (
    <FootnoteListProvider>
      <FootnotesTable/>
    </FootnoteListProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(FootnoteList);