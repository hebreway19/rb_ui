import { ClearOutlined, OrderedListOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { useMediaQuery } from "react-responsive";

import { RoutePath } from "../../../../constants";
import { useWordMeaningTranslate } from "../../../../shared/hooks";
import { HebButton, HebInput, HebRadio, HebTooltip } from "../../../../components/HebElements";
import { useFootnoteList } from "../../../../providers";
import PropTypes, { InferProps } from "prop-types";

export const FootnoteTableControl = ({
                                       updateDisplayDataTable,
                                       setSearchValue
                                     }: InferProps<typeof FootnoteTableControl.propTypes>) => {
  const router = useRouter();
  const {translate, updateTranslate} = useWordMeaningTranslate();
  const {t} = useTranslation();
  const {
    findFootnoteListFromRecycleBin,
    refreshFootnoteList,
    isVisibleRecycleBinList,
    setIsVisibleRecycleBinList
  } = useFootnoteList();

  const openNew = useCallback(async () => {
    await router.push({pathname: (RoutePath.LIST(RoutePath.FOOTNOTES(RoutePath.TEACHER()))), query: {footnoteId: "new"}});
  }, [router])

  const onSearch = useCallback(async (value) => {
    setSearchValue(value);
  }, [setSearchValue])

  const changeLanguageWordMeaning = useCallback((e) => {
    updateTranslate(e.target.value);
  }, [updateTranslate]);

  const changeFootnoteListType = useCallback(() => {
    isVisibleRecycleBinList
      ? refreshFootnoteList()
      : findFootnoteListFromRecycleBin()
    setIsVisibleRecycleBinList(oldState => !oldState)
  }, [findFootnoteListFromRecycleBin, isVisibleRecycleBinList, refreshFootnoteList, setIsVisibleRecycleBinList])

  const isTabletOrMobile = useMediaQuery({query: "(max-width: 768px)"});

  return (
    <Row justify="space-between" className={isTabletOrMobile ? "mobile-control" : ""} gutter={[8, 8]}>
      <Col {...isTabletOrMobile && ({xs: 24})}>
        <HebTooltip
          title={t("pages.footnote_list.controls.tooltips.create_new")}
          placement="top"
        >
          <HebButton onClick={openNew}
                     overText={false}
                     buttonSize="over-small"
                     viewType="secondary"
                     {...isTabletOrMobile && ({block: true})}>
            {t("pages.footnote_list.controls.create_new")}
          </HebButton>
        </HebTooltip>
      </Col>
      <Col {...isTabletOrMobile && ({xs: 24})}>
        <Row gutter={[8, 8]}>
          <Col style={{width: isTabletOrMobile ? "calc(100% - 4.8rem)" : "28rem"}}>
            <HebInput.Search placeholder={t("pages.footnote_list.controls.search.input")}
                             onSearch={onSearch} style={{width: "100%"}}
                             enterButton
                             cssType={"primary"}
                             size="over-small"/>
          </Col>
          <Col>
            <HebTooltip
              title={t("pages.footnote_list.controls.tooltips.clear")}
              placement="top"
            >
              <HebButton onClick={() => updateDisplayDataTable()} buttonSize="over-small"><ClearOutlined/></HebButton>
            </HebTooltip>
          </Col>
        </Row>
      </Col>
      <Col {...isTabletOrMobile && ({width: "calc(100% - 3.875rem)"})}>
        <HebRadio.Group
          optionType="button"
          defaultValue={translate}
        >
          <HebRadio.Button
            value='en'
            onClick={changeLanguageWordMeaning}
          >
            En
          </HebRadio.Button>
          <HebRadio.Button
            value='ru'
            onClick={changeLanguageWordMeaning}
          >
            Ru
          </HebRadio.Button>
          <HebRadio.Button
            value='fr'
            onClick={changeLanguageWordMeaning}
          >
            Fr
          </HebRadio.Button>
        </HebRadio.Group>
      </Col>
      <Col>
        <HebTooltip
          placement="top"
          title={ isVisibleRecycleBinList
            ? t("pages.footnote_list.controls.hide_trash_footnotes")
            : t("pages.footnote_list.controls.show_trash_footnotes")
          }
        >
          <HebButton buttonSize="over-small"
                     viewType="text"
                     block
                     onClick={changeFootnoteListType}
                     icon={ <OrderedListOutlined /> }
          />
        </HebTooltip>
      </Col>
    </Row>
  );
}

FootnoteTableControl.propTypes = {
  updateDisplayDataTable: PropTypes.func,
  setSearchValue: PropTypes.func
}
FootnoteTableControl.defaultProps = {
  updateDisplayDataTable: () => {},
  setSearchValue: (callback?) => {}
};