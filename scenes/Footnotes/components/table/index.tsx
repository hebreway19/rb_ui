import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FootnoteTableColumns } from "./columns";
import { ShowInfoIcon, UpdateInfoIcon } from "../../../../shared/icons";
import { FootnoteTableControl } from "./controls";
import { RoutePath } from "../../../../constants";
import { HebDrawer, HebPageHeader, HebTable, HebTooltip } from "../../../../components/HebElements";
import { Button, Col, List, Row, Spin } from "antd";
import { useTranslation } from "next-i18next";
import { useMediaQuery } from "react-responsive";
import { useWordMeaningTranslate } from "../../../../shared/hooks";
import { FileUploadComponent, SimpleAudioComponent } from "../../../../shared/components";
import { Footnote } from "../../../../types";
import { FootnoteForm } from "../FootnoteForm";
import { FootnoteFormProvider, useFootnoteList } from "../../../../providers";

const {ID, LIST, FOOTNOTES, TEACHER} = RoutePath;
const DesktopTable = ({
                        refreshFootnoteList,
                        updateFootnoteListByWord,
                        pageHeaderTitle,
                        didLoaded,
                        resultColumns,
                        footnotePage,
                        tableLocale,
                        docsCount,
                        changeTable
}) => {
  return (
    <div className={"desktop-table"}>
      <div className="page-footnote-list__container">
        <div className="page-footnote-list__header">
          <Row justify="space-between">
            <Col>
              <h3>{pageHeaderTitle}</h3>
            </Col>
          </Row>
          <FootnoteTableControl updateDisplayDataTable={refreshFootnoteList}
                                setSearchValue={updateFootnoteListByWord}/>
        </div>
        <Spin spinning={didLoaded} >
          <HebTable columns={resultColumns}
                    rowKey={"_id"}
                    dataSource={footnotePage?.docs}
                    locale={tableLocale}
                    pagination={{
                      position: ["bottomCenter"],
                      onChange: page => {
                        refreshFootnoteList(page);
                      },
                      pageSize: 8,
                      total: docsCount,
                      showSizeChanger: false
                    }}
                    onChange={changeTable} />
        </Spin>
      </div>
    </div>

  );
}
const ExpandedRowRenderComponent = ({footnote, updateFileField}) => {
  const {translate} = useWordMeaningTranslate();
  const getIdAndFilename = (id) => (filename) => {
    updateFileField && updateFileField(id, filename._id);
  };

  const {t} = useTranslation();


  const translationOption = t("pages.footnote_list.table.title.word_meaning." + translate);

  return (
    <Row gutter={[0, 36]}>
      <Col xs={24} className="wordMeaning">
        <Row gutter={8}>
          <Col xs={10} style={{textAlign: "right"}}>
            <span className="head">
              {translationOption}:
            </span>
          </Col>
          <Col xs={14}>
            {footnote?.wordMeaning[translate]}
          </Col>
        </Row>
      </Col>
      <Col xs={24} className="uploadComponent">
        <Row justify="end">
          <Col>
            {footnote?.fileId
             ? <SimpleAudioComponent dataId={footnote?.fileId}/>
             : <FileUploadComponent
               accept="audio/*"
               maxCountFileList={1}
               label={false}
               onDone={getIdAndFilename(footnote?._id)}
             />
            }
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
const MobileTable = ({
                       refreshFootnoteList,
                       updateFootnoteListByWord,
                       pageHeaderTitle,
                       didLoaded,
                       resultColumns,
                       updatedRowSelection,
                       footnotePage,
                       tableLocale,
                       docsCount,
                       changeTable,
                       updateFileField
}) => {
  const {translate} = useWordMeaningTranslate();
  const footnoteDetailsRoutePath = ID(LIST(FOOTNOTES(TEACHER())));
  const router = useRouter();
  const {t} = useTranslation();

  const getIdAndFilename = (id) => (filename) => {
    updateFileField && updateFileField(id, filename._id);
  };

  return (
    <div className={"mobile-table"}>
      <div className="page-footnote-list__container">
        <HebPageHeader title={pageHeaderTitle} />
        <FootnoteTableControl updateDisplayDataTable={refreshFootnoteList}
                              setSearchValue={updateFootnoteListByWord}/>
        <Spin spinning={didLoaded} >
          <List dataSource={footnotePage?.docs}
                pagination={{
                  onChange: page => {
                    refreshFootnoteList(page);
                  },
                  pageSize: 8,
                  total: docsCount,
                  showLessItems: true
                }}
                renderItem={(item: Footnote) => (
                  <List.Item style={{padding: 0}}>
                    <Row style={{width: "100%"}}>
                      <Col xs={24} style={{overflow: "hidden"}}>
                        <Row gutter={42}>
                          <Col xs={12}
                               style={{
                                 textAlign: "right",
                                 overflowWrap: "anywhere"
                               }}
                               className="item-title" lang="he">
                            {item?.word?.he_nikkudot || item?.word?.he}
                          </Col>
                          <Col xs={12} className="item-title">
                            {item?.wordMeaning[translate]}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={24} className="item-control">
                        <Row>
                          <Col xs={8} >
                            <Row>
                              <Col xs={24} style={{textAlign: "center"}}>
                                { item?.audio
                                  ? <SimpleAudioComponent dataId={item?.audio}/>
                                  : <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M14.5 0.0625C6.52715 0.0625 0.0625 6.52715 0.0625 14.5C0.0625 22.4729 6.52715 28.9375 14.5 28.9375C22.4729 28.9375 28.9375 22.4729 28.9375 14.5C28.9375 6.52715 22.4729 0.0625 14.5 0.0625ZM14.5 26.4883C7.88066 26.4883 2.51172 21.1193 2.51172 14.5C2.51172 7.88066 7.88066 2.51172 14.5 2.51172C21.1193 2.51172 26.4883 7.88066 26.4883 14.5C26.4883 21.1193 21.1193 26.4883 14.5 26.4883Z" fill="#3C3C3E"/>
                                      <path d="M21.1838 14.0845L11.6415 7.15578C11.565 7.09968 11.4744 7.06593 11.3798 7.0583C11.2852 7.05067 11.1904 7.06945 11.1058 7.11255C11.0213 7.15566 10.9504 7.22139 10.901 7.30242C10.8516 7.38346 10.8257 7.47661 10.8262 7.5715V21.4289C10.8262 21.8511 11.3031 22.0896 11.6415 21.8446L21.1838 14.9159C21.2497 14.8685 21.3033 14.806 21.3403 14.7337C21.3773 14.6615 21.3966 14.5814 21.3966 14.5002C21.3966 14.419 21.3773 14.339 21.3403 14.2667C21.3033 14.1944 21.2497 14.132 21.1838 14.0845V14.0845ZM12.8822 18.4028V10.5976L18.2544 14.5002L12.8822 18.4028V18.4028Z" fill="#3C3C3E"/>
                                    </svg>
                                }
                              </Col>
                              <Col xs={24} style={{textAlign: "center"}} className="list-item-button-label">
                                Audio
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={8}>
                            <Row justify="center">
                              <Col>
                                <FileUploadComponent
                                  accept="audio/*"
                                  maxCountFileList={1}
                                  label={false}
                                  isMobileFootnotes={true}
                                  onDone={getIdAndFilename(item?._id)}
                                />
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={8}>
                            <Row>
                              <Col xs={24} style={{textAlign: "center"}} onClick={() => router.push(footnoteDetailsRoutePath.replace("/[id]", `?footnoteId=${item?._id}`))}>
                                <svg width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    d="M15.5 29.25C23.0941 29.25 29.25 23.0941 29.25 15.5C29.25 7.90588 23.0941 1.75 15.5 1.75C7.90588 1.75 1.75 7.90588 1.75 15.5C1.75 23.0941 7.90588 29.25 15.5 29.25Z"
                                    stroke="#3C3C3E" strokeWidth="2" strokeLinejoin="round"/>
                                  <path
                                    d="M8.625 17.5625C9.76409 17.5625 10.6875 16.6391 10.6875 15.5C10.6875 14.3609 9.76409 13.4375 8.625 13.4375C7.48591 13.4375 6.5625 14.3609 6.5625 15.5C6.5625 16.6391 7.48591 17.5625 8.625 17.5625Z"
                                    fill="#3C3C3E"/>
                                  <path
                                    d="M15.5 17.5625C16.6391 17.5625 17.5625 16.6391 17.5625 15.5C17.5625 14.3609 16.6391 13.4375 15.5 13.4375C14.3609 13.4375 13.4375 14.3609 13.4375 15.5C13.4375 16.6391 14.3609 17.5625 15.5 17.5625Z"
                                    fill="#3C3C3E"/>
                                  <path
                                    d="M22.375 17.5625C23.5141 17.5625 24.4375 16.6391 24.4375 15.5C24.4375 14.3609 23.5141 13.4375 22.375 13.4375C21.2359 13.4375 20.3125 14.3609 20.3125 15.5C20.3125 16.6391 21.2359 17.5625 22.375 17.5625Z"
                                    fill="#3C3C3E"/>
                                </svg>
                              </Col>
                              <Col xs={24} style={{textAlign: "center"}} className="list-item-button-label">
                                {t("components.table.tooltips.details")}
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </List.Item>
                )}/>
        </Spin>
      </div>
    </div>
  );
}

export const FootnotesTable = () => {
  const footnoteListRoutePath = LIST(FOOTNOTES(TEACHER()));
  const footnoteDetailsRoutePath = ID(footnoteListRoutePath);
  const {t} = useTranslation();
  const router = useRouter();
  const {footnoteId} = router.query
  const {
    footnotePage,
    didLoaded,
    setFilteredInfo,
    refreshFootnoteList,
    findFootnoteListByWord,
    updateFileField,
    isVisibleRecycleBinList,
    findFootnoteListFromRecycleBin
  } = useFootnoteList();
  const [selectedFootnote, setSelectedFootnote] = useState<string>(undefined);

  const isTabletOrMobile = useMediaQuery({query: "(max-width: 768px)"});

  const changeTable = useCallback((pagination, filters) => {
    setFilteredInfo(filters);
  }, [setFilteredInfo]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [select, setSelect] = useState({
    selectedRowKeys: [],
    loading: false
  });

  const updateTable = useCallback(async () => {
    isVisibleRecycleBinList ? await findFootnoteListFromRecycleBin(footnotePage.page)
                            : await refreshFootnoteList(footnotePage.page)
  },  [footnotePage, findFootnoteListFromRecycleBin, refreshFootnoteList])

  const closeForm = useCallback(async () => {
    await router.push(footnoteListRoutePath)
    await updateTable();
    setSelectedFootnote(undefined);
  }, [router]);

  useEffect(() => {
    if (footnoteId) {
      setSelectedFootnote(Array.isArray(footnoteId)
                          ? footnoteId[0]
                          : footnoteId)
    }
  }, [footnoteId]);

  let resultColumns = FootnoteTableColumns({t, updateFileField, isMobile: isTabletOrMobile});
  resultColumns.push({
                       title: (
                         <HebTooltip placement="topRight"
                                     title={t("components.table.tooltips.updateDisplayDataTable")}>
                           <Button icon={<UpdateInfoIcon/>}
                                   className={"page-footnote-list__update-list"}
                                   type="text"
                                   onClick={updateTable}/>
                         </HebTooltip>
                       ),
                       dataIndex: "controls",
                       width: isTabletOrMobile ? (60) : (32 + 20 * 2),
                       key: "controls",
                       render: (text, render, index) => (<HebTooltip placement="topRight"
                                                                     title={t("components.table.tooltips.details")}>
                         <Button icon={<ShowInfoIcon/>}
                                 type="text"
                                 className={"page-footnote-list__update-list"}
                                 onClick={() => router.push(footnoteDetailsRoutePath.replace("/[id]",
                                                                                             `?footnoteId=${render?._id}`))}/>
                       </HebTooltip>)
                     })

  const docsCount = footnotePage.totalDocs;
  const tableLocale = {
    triggerDesc: t("components.table.columns.tooltips.trigger_desc"),
    triggerAsc: t("components.table.columns.tooltips.trigger_asc"),
    cancelSort: t("components.table.columns.tooltips.cancel_sort"),
  };

  const { selectedRowKeys } = select;
  const updatedRowSelection = {
    ...{
      selectedRowKeys,
      onChange: (selectedRowKeysValue, items) => {
        setSelectedItems(items);
        setSelect({
          ...select,
          selectedRowKeys: selectedRowKeysValue
        });
      }
    }
  }

  const updateFootnoteListByWord = useCallback(async (value) => {
    await findFootnoteListByWord(value)
  }, [findFootnoteListByWord]);

  const pageHeaderTitle = t("navs.footnote_list");

  return (
    <>
      { isTabletOrMobile ? <MobileTable refreshFootnoteList={refreshFootnoteList}
                                        updateFootnoteListByWord={updateFootnoteListByWord}
                                        pageHeaderTitle={pageHeaderTitle}
                                        didLoaded={didLoaded}
                                        updateFileField={updateFileField}
                                        resultColumns={resultColumns}
                                        updatedRowSelection={updatedRowSelection}
                                        footnotePage={footnotePage}
                                        tableLocale={tableLocale}
                                        docsCount={docsCount}
                                        changeTable={changeTable} />
                        : <DesktopTable refreshFootnoteList={refreshFootnoteList}
                                        updateFootnoteListByWord={updateFootnoteListByWord}
                                        pageHeaderTitle={pageHeaderTitle}
                                        didLoaded={didLoaded}
                                        resultColumns={resultColumns}
                                        footnotePage={footnotePage}
                                        tableLocale={tableLocale}
                                        docsCount={docsCount}
                                        changeTable={changeTable} />
      }
      <HebDrawer onClose={closeForm}
                 visible={!!selectedFootnote}>
        <FootnoteFormProvider>
          <FootnoteForm onDone={() => router.push(footnoteListRoutePath.replace("/[id]", `?footnoteId=${selectedFootnote}`))}
                        id={selectedFootnote} />
        </FootnoteFormProvider>
      </HebDrawer>
    </>);
}