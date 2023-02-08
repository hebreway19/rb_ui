import { Button, Col, Empty, List, message, Row, Spin, Tooltip, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useFootnoteService } from "../../../../services";
import { FootnoteForm } from "../../../Footnotes/components";
import { useTranslation } from "next-i18next";
import { InfoCircleOutlined, PlusSquareOutlined, RetweetOutlined, SelectOutlined } from "@ant-design/icons";
import { SimpleAudioComponent } from "../../../../shared/components";
import { LanguageCode, RoutePath } from "../../../../constants";
import nl2br from "react-nl2br";
import { HebDrawer, HebInput, HebTooltip, HebTypography } from "../../../../components/HebElements";
import { useMediaQuery } from "react-responsive";
import { useFootnoteForm } from "../../../../providers";
import { Footnote } from "../../../../types";
import { StringUtil } from "../../../../util";

interface AddFootnotePanel {
  word: string;

  onDone(footnote: Footnote): void;

  defaultLang?: LanguageCode;
  contentState?: any;

  onCloseEvent?(...args): any;
}

export const AddFootnotePanel = ({
                                   word,
                                   onDone,
                                   defaultLang,
                                   contentState,
                                   onCloseEvent
                                 }: AddFootnotePanel) => {
  const {ID_FOOTNOTE, LIST, TEACHER, FOOTNOTES} = RoutePath;

  const {
    footnote,
    setFootnote,
    updateFromStateField
  } = useFootnoteForm();
  const {t} = useTranslation();

  const [foundFootnoteList, setFoundFootnoteList] = useState({docs: []});
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleFootnoteForm, setIsVisibleFootnoteForm] = useState(false);
  const [oldId, setOldId] = useState(null);

  useEffect(() => {
    setSearchText(word.trim());
    setFootnote(oldState => ({...oldState,
                                    title: {he_nikkudot: word.trim(),
                                            he: StringUtil.removeNikkudots(word.trim())
    }}));
  }, [word]);

  const footnoteService = useFootnoteService();

  const updateFootnoteList = useCallback(async (value) => {
    if (value != null && value !== "" && /\S/.test(value)) {
      try {
        setIsLoading(true);
        setIsVisibleFootnoteForm(false);
        const result = await footnoteService.findFootnoteListByWord(value);
        setFoundFootnoteList(result);
      } catch (error) {
        message.warn(error.message);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    } 
  }, []);

  const onClose = useCallback(() => {
    setIsVisible(false);
    onCloseEvent && onCloseEvent();
    setFoundFootnoteList({docs: []});
  }, [onCloseEvent]);

  const onSearch = useCallback(async () => {
    setFootnote(oldFootnote => ({...oldFootnote, ...{word: {he_nikkudot: searchText}}}));
    await updateFootnoteList(searchText);
  }, [updateFootnoteList, searchText, setFootnote]);

  const onSelect = useCallback((footnote) => {
    onDone && onDone(footnote);
    onClose();
  }, [onDone, onClose]);
  const updateFootnotesPageAndHideFootnoteForm = useCallback(async () => {
    await updateFootnoteList(setSearchText);
    setIsVisibleFootnoteForm(false);
  }, [updateFootnoteList]);

  useEffect(() => {
    const updateFootnotesListAsync = async () => {
      try {
        await updateFootnoteList(word);
        updateFromStateField("isNewFootnote", true);
        updateFromStateField("fastCreate", true);
        setFootnote(oldFootnote => ({ ...oldFootnote, ...{ word: { he_nikkudot: searchText } } }))
      } catch (error) {
        console.error(error);
        await message.warning(error.message);
      }
    };
    setIsLoading(true);
    setIsVisible(word !== "" && word !== undefined);
    word && updateFootnotesListAsync();
  }, [word, contentState, setFootnote, updateFootnoteList, updateFromStateField]);

  useEffect(() => {
    if (footnote._id !== undefined && footnote !== oldId) {
      setOldId(footnote._id);
      onDone && onDone(footnote);
      delete footnote._id;
      delete footnote.wordMeaning;
    }
  }, [footnote, oldId, onDone]);

  const entity = t("entities.footnote").toLowerCase();
  const titleLabel = t("pages.footnote.searcher_by_word.title");
  const chooseButtonLabel = t("pages.footnote.searcher_by_word.buttons.choose.label");
  const chooseButtonTooltip = t("pages.footnote.searcher_by_word.buttons.choose.tooltip");
  const createNewFootnoteTooltip = t("actions.create.entity", {entity: entity});

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)"
  });

  const isBigScreen = useMediaQuery({query: "(min-device-width: 1824px)"});
  const isTabletOrMobile = useMediaQuery({query: "(max-width: 1224px)"});
  const isTabletOrMobileDevice = useMediaQuery({query: "(max-device-width: 1224px)"});
  const isLandscape = useMediaQuery({query: "(orientation: landscape)"});
  const isHugeScreen = isDesktopOrLaptop || isBigScreen || ((isTabletOrMobile || isTabletOrMobileDevice) && isLandscape);

  return (
    <HebDrawer
      title={
        <Row gutter={16} style={{marginBottom: 10}}          {...!isHugeScreen && ({justify: "space-between"})}        >
          <Col {...!isHugeScreen && ({xs: 24})}>
            <HebTypography.Title level={3}>{titleLabel}</HebTypography.Title>
          </Col>
          <Col>
            <HebTypography.Title level={3} lang="he" dir="rtl">
              &quot;{searchText}&quot;
            </HebTypography.Title>
          </Col>
          <Col>
            <Button
              type="text"
              onClick={() => updateFootnoteList(word)}
              icon={<RetweetOutlined/>}
            />
          </Col>
        </Row>
      }
      width={process.browser && window.innerWidth < 640 ? window.innerWidth : 640}
      visible={isVisible}
      onClose={onClose}>
      <Spin spinning={isLoading}>
        <Row style={{marginBottom: "1rem"}}>
          <Col xs={24}>
            <HebInput.Search enterButton
                             cssType="primary"
                             dir="rtl"
                             value={searchText}
                             onChange={({target}) => setSearchText(target.value)}
                             onSearch={onSearch}/>
          </Col>
        </Row>
        {foundFootnoteList?.docs && (foundFootnoteList.docs.length > 0)
         ? <>
           <Row>
             <Col xs={24}>
               <List
                 bordered
                 itemLayout="vertical"
                 dataSource={foundFootnoteList?.docs}
                 renderItem={(footnote, index) => (
                   <List.Item
                     key={index}
                     actions={[
                       <HebTooltip placement="topLeft" title={chooseButtonTooltip} key={0}>
                         <Button type="text" onClick={() => {
                           onSelect(footnote);
                         }}>
                           <SelectOutlined/>
                           {chooseButtonLabel}
                         </Button>
                       </HebTooltip>,
                       <HebTooltip placement="top" title={"ShareButtonTooltip"} key={1}>
                         <Typography.Link href={ID_FOOTNOTE(LIST(FOOTNOTES(TEACHER()))).replace(":footnoteId", footnote._id)} target="_blank">
                           <Button type="text" icon={<InfoCircleOutlined/>}/>
                         </Typography.Link>

                       </HebTooltip>
                     ]}
                   >
                     <List.Item.Meta
                       title={
                         <Row gutter={16} align="middle">
                           <Col flex="6">
                             <HebTypography.Title level={3}>
                               {t("pages.footnote.form.word.label")}
                             </HebTypography.Title>
                           </Col>
                           <Col flex="9">
                             <HebTypography.Title level={3} dir="rtl" lang="he" style={{textAlign: "right", width: "100% !important"}}>
                               {footnote.word.he_nikkudot}
                             </HebTypography.Title>
                           </Col>
                           <Col flex="1" hidden={!footnote.fileId}>
                             <SimpleAudioComponent dataId={footnote.fileId}/>
                           </Col>
                         </Row>
                       }
                     />
                     <Typography.Title level={5}>
                       {t("pages.footnote.form.wordMeaning.en.label")}
                     </Typography.Title>
                     <Typography.Paragraph ellipsis={{rows: 2, expandable: true, symbol: t("more")}}>
                       {footnote.wordMeaning.en
                        ? footnote.wordMeaning.en
                        : "-"
                       }
                     </Typography.Paragraph>
                     <Typography.Title level={5}>
                       {t("pages.footnote.form.wordMeaning.ru.label")}
                     </Typography.Title>
                     <Typography.Paragraph ellipsis={{rows: 2, expandable: true, symbol: t("more")}}>
                       {footnote.wordMeaning.ru
                        ? footnote.wordMeaning.ru
                        : "-"
                       }
                     </Typography.Paragraph>
                     <Typography.Title level={5}>
                       {t("pages.footnote.form.wordMeaning.fr.label")}
                     </Typography.Title>
                     <Typography.Paragraph ellipsis={{rows: 2, expandable: true, symbol: t("more")}}>
                       {footnote.wordMeaning.fr
                        ? footnote.wordMeaning.fr
                        : "-"
                       }
                     </Typography.Paragraph>
                   </List.Item>
                 )}/>
             </Col>
           </Row>
         </>
         : <>
           <Row>
             <Col
               hidden={isVisibleFootnoteForm}
               xs={24}
             >
               <Empty>
                 <Tooltip
                   placement="top"
                   title={nl2br(createNewFootnoteTooltip)}
                 >
                   <Button
                     type="text"
                     onClick={() => setIsVisibleFootnoteForm(true)}
                     icon={<PlusSquareOutlined/>}
                   />
                 </Tooltip>
               </Empty>
             </Col>
           </Row>
           {isVisibleFootnoteForm
            && <div style={{margin: "auto -1.5rem"}}>
              <FootnoteForm onDone={updateFootnotesPageAndHideFootnoteForm} defaultLang={defaultLang}/>
            </div>
           }
         </>
        }
      </Spin>
    </HebDrawer>
  );
};