import React, { useCallback, useState } from "react";
import { Col, message, Row, Tag, Typography } from "antd";
import { useFootnoteService } from "../../../../services";
import { useTranslation } from "next-i18next";
import { SimpleAudioComponent } from "../../../../shared/components";
import { HebButton, HebPopover, HebTypography } from "../../../../components/HebElements";

interface ContentFootnoteProps {
  word?: string;
  dataId?: string;
  mode?: "edit" | string;
  language?: string;
  onDelete?(e?: React.MouseEvent<HTMLElement, MouseEvent>): void;
  onClick?(e?: React.MouseEvent<HTMLElement, MouseEvent>): void;
}

export const ContentFootnote = ({
                                  word,
                                  dataId,
                                  onDelete,
                                  mode = "edit",
                                  language,
                                  onClick
                                }: ContentFootnoteProps) => {
  const {t} = useTranslation();

  const [footnote, setFootnote] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const wordMeaningLabel = t("pages.footnote.form.wordMeaning.label");
  const wordMeaningHeLabel = t("pages.footnote.form.wordMeaning.he.label");
  const learnMoreButton = t("pages.footnote.form.buttons.learn_more.label");

  const footnoteService = useFootnoteService();

  const loadFootnote = useCallback(async (id) => {
    try {
      setIsLoaded(true);
      const foundFootnote = await footnoteService.getFootnoteById(id);
      setFootnote(foundFootnote);
      setIsLoaded(false);
    } catch (error) {
      console.error(error);
      await message.warn(error.message);
    }
  }, [footnoteService]);
  const popoverTitle = (
    <Row justify="space-between">
      <Col hidden={footnote?.audio === undefined}><SimpleAudioComponent dataId={footnote?.audio}/></Col>
      <Col {...(footnote?.audio === undefined ? {xs: 24} : {})}>
        <HebTypography.Title level={5} lang="he" dir="rtl" style={{color: "#fff"}}>
          {footnote?.word?.he_nikkudot}
        </HebTypography.Title>
      </Col>
    </Row>
  );
  const popoverContent = (
    <Row gutter={[8,8]}>
      <Col xs={24} hidden={!footnote?.wordMeaning?.he_nikkudot && !footnote?.wordMeaning?.he} style={{textAlign: "right"}}>
        <HebTypography.Text strong style={{color: "#fff"}}>{wordMeaningHeLabel}</HebTypography.Text>
        <HebTypography.Paragraph dir="rtl" lang="he" style={{color: "#fff"}}>
          {footnote?.wordMeaning?.he_nikkudot || footnote?.wordMeaning?.he || ""}
        </HebTypography.Paragraph>
      </Col>
      <Col xs={24}
           hidden={!footnote?.wordMeaning?.[language]}>
        <Typography.Text strong style={{color: "#fff"}}>{wordMeaningLabel}</Typography.Text>
        <Typography.Paragraph style={{color: "#fff"}}>
          {footnote?.wordMeaning?.[language] || ""}
        </Typography.Paragraph>
      </Col>
      <Col xs={24}
           hidden={!(footnote?.externalReference)}>
        <Typography.Link href={footnote?.externalReference} target="_blank">
          <HebButton block buttonSize="over-small">
            {`${learnMoreButton}...`}
          </HebButton>
        </Typography.Link>
      </Col>
    </Row>
  );

  const isEditMode = mode === "edit";

  const tag = (
    <Tag color="green" onClick={() => {
      !isLoaded && loadFootnote(dataId);
      onClick();
    }} closable={isEditMode} onClose={isEditMode && onDelete} dir="rtl" lang="he">
      <a href={`#${word}`}>
        {word}
      </a>
    </Tag>);

  const tagForStudent = (
    <HebTypography.Text strong dir="rtl" lang="he">
      <a href={`#${word}`}>
        {word}
      </a>
    </HebTypography.Text>)

  return (
    <>
      {
        isEditMode
          ? tag
          : (<HebPopover placement="top"
                         dir="rtl"
                         lang="he"
                         trigger="click"
                         onClick={event => {
                           !isLoaded && loadFootnote(dataId);
                           event.stopPropagation();
                         }}
                         content={popoverContent}
                         title={popoverTitle}>{tagForStudent}</HebPopover>)
      }
    </>
  );
};