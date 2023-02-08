import React from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps } from "next";
import { HomePageLayout } from "../components/HomePage";

export const Home = () => <HomePageLayout />

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default Home;