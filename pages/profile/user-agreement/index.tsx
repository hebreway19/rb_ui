import React, { useCallback, useEffect, useState } from "react";
import { Col, message, Row, Typography } from "antd";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TurndownService from "turndown";

import { UserAgreementService } from "../../../services";
import { ChangeLanguageAgreement } from "../../../shared/components";
import { HebButton, HebPageHeader } from "../../../components/HebElements";
import { LocalizedContent } from "../../../types";
import { LanguageCode } from "../../../constants";
import { withMainLayout } from "../../../hocs";
import dynamic from "next/dynamic";
import { GetServerSideProps } from "next";

const Editor: any = dynamic(() => import("../../../components/Editor"), {ssr: false});

const EditAgreementPage = () => {
  const showdown = require("showdown");
  const turndownService = new TurndownService();
  const converter = new showdown.Converter();

  const {t} = useTranslation();
  const {Title} = Typography;
  const [didLoaded, setDidLoaded] = useState(false);
  const [lang, setLang] = useState(LanguageCode.EN);
  const [agreement, setAgreement] = useState<LocalizedContent>({
                                                                 ru: "",
                                                                 en: "",
                                                                 fr: "",
                                                                 he: ""
                                                               });

  useEffect(() => {
    const loadAgreement = async () => {
      try {
        setDidLoaded(false);
        const loadedAgreement = await UserAgreementService.getAgreement();
        setAgreement(loadedAgreement);
      }
      catch (error) {
        console.error(error);
      }
      finally {
        setDidLoaded(true);
      }
    };
    if (!didLoaded) {
      loadAgreement();
    }
  }, [didLoaded]);

  const convertMarkdown = useCallback((data) => turndownService.turndown(data), [turndownService]);

  const updateAgreement = useCallback(async () => {
    try {
      setDidLoaded(false);
      const updatedAgreement = await UserAgreementService.updateUserAgreement(agreement);
      setAgreement(updatedAgreement);
      setDidLoaded(true);
      message.success(t("messages.saved"));
    } catch (error) {
      console.error(await error);
      message.warn((await error).message);
    } finally {
      setDidLoaded(true);
    }
  }, [agreement]);

  const handleCkeditorState = useCallback((event, editor) => setAgreement(previousAgreement => ({
    ...previousAgreement, [lang]: convertMarkdown(editor.getData())
  })), [lang, convertMarkdown]);

  const titlePageLabel: string = t("pages.user_agreement.title");
  const saveButtonLabel: string = t("pages.user_agreement.button");

  return (
    <div className="user-agreement-page">
      <HebPageHeader title={titlePageLabel}
                     extra={
                       <Row style={{width: "100%", height: "100%"}} align="middle">
                         <Col>
                           <ChangeLanguageAgreement changeLanguage={setLang} language={lang}/>
                         </Col>
                       </Row>
                     } />
      <Row justify="center">
        <Col xs={22}>
          <Row justify="center" gutter={[16, 16]}>
            <Col xs={24}>
              <div>
                {
                  process.browser && <Editor key={lang}
                                             data={converter.makeHtml((agreement && agreement[lang]) || "")}
                                             value={converter.makeHtml((agreement && agreement[lang]) || "")}
                                             onInit={(editor) => console.log(editor)}
                                             config={
                                               {
                                                 language: lang,
                                                 toolbar: [
                                                   "heading", "|", "bold", "italic", "blockQuote", "link", "numberedList", "bulletedList",
                                                   "insertTable", "tableColumn", "tableRow", "mergeTableCells", "mediaEmbed", "|", "undo", "redo"
                                                 ]
                                               }
                                             }
                                             onChange={handleCkeditorState}
                  />
                }
              </div>
            </Col>
            <Col xs={24} style={{textAlign: "center"}}>
              <HebButton overText={false} style={{minWidth: "200px"}} buttonSize="over-small" onClick={updateAgreement}>
                {saveButtonLabel}
              </HebButton>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({locale}) => {
  return {
    props: {
      ...(await serverSideTranslations(locale))
    }
  };
};

export default withMainLayout(EditAgreementPage);