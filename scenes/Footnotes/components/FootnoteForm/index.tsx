import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { Col, Divider, Row, Spin } from "antd";
import nl2br from "react-nl2br";
import { DeleteOutlined, QuestionCircleOutlined, RollbackOutlined, SaveOutlined, SettingOutlined, ShareAltOutlined } from "@ant-design/icons";
import dynamic from "next/dynamic";

import { FootnoteParamsPanel } from "./FootnoteParamsPanel";
import { useWordMeaningTranslate } from "../../../../shared/hooks";
import { StandardAudioComponent } from "../../../../shared/components";
import { RecorderModal } from "../../../../shared/components/AudioComponents/AudioRecorderComponent";
import { HebButton, HebForm, HebInput, HebPageHeader, HebPopconfirm, HebSwitch, HebTextArea, HebTooltip } from "../../../../components/HebElements";
import { useFootnoteForm } from "../../../../providers";
import { LanguageCode } from "../../../../constants";

const FootnoteFormTour = dynamic(() => import("./FootnoteFormTour"), {ssr: false});

interface FootnoteFormProps {
  id?: string;
  defaultLang?: LanguageCode;

  onDone(...args): any;
}

export const FootnoteForm = ({onDone, id, defaultLang}: FootnoteFormProps) => {
  const {t} = useTranslation();
  const {
    footnote,
    formState,
    removeFromRecycleBin,
    form,
    handleFootnoteChange,
    saveFootnote,
    updateFromStateField,
    shareFootnote,
    addAudioToFootnote,
    removeAudio,
    delFootnote,
    isValid,
    loadFootnoteById
  } = useFootnoteForm();
  const {translate} = useWordMeaningTranslate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [isVisibleRecorder, setIsVisibleRecorder] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);

  const entity = t("entities.footnote");

  const saveButtonTooltip = !form.isFieldsTouched(false)
                            ? t("tooltips.action_not_available_cause_of_reason", {reason: t("tooltips.reasons.nothing_changed").toLowerCase()})
                            : !isValid
                              ? t("tooltips.action_not_available_cause_of_reason", {reason: t("tooltips.reasons.entered_data_are_invalid").toLowerCase()})
                              : formState.isNewFootnote
                                ? t("tooltips.press_to_action", {action: t("actions.create.entity", {entity: entity.toLowerCase()}).toLowerCase()})
                                : t("tooltips.press_to_action", {action: t("actions.save", {entity: entity.toLowerCase()}).toLowerCase()});
  const saveButtonLabel = formState.isNewFootnote
                          ? t("actions.create.entity", {entity: ""})
                          : t("actions.save", {entity: ""});

  const restoreButtonTooltip = t("tooltips.press_to_action", { action: t("actions.restore", { entity: t("entities.footnote")}).toLowerCase() });

  const shareButtonTooltip = t("tooltips.press_to_action", {action: t("actions.share.with_teachers", {entity: entity.toLowerCase()}).toLowerCase()});

  const footnoteWordLabel = t("pages.footnote.form.word.label");
  const footnoteWordTooltip = t("pages.footnote.form.word.tooltip");

  const footnoteWordMeaningLabel = t("pages.footnote.form.wordMeaning.label");
  const footnoteWordMeaningTooltip = t("pages.footnote.form.wordMeaning.tooltip");

  const footnoteExternalReferenceLabel = t("pages.footnote.form.externalReference.label");
  const footnoteExternalReferenceTooltip = t("pages.footnote.form.externalReference.tooltip");

  const footnoteAudioLabel = t("pages.footnote.form.audio.label");
  const footnoteAudioTooltip = t("pages.footnote.form.audio.tooltip");

  const showWithoutNikkudotLabel = t('pages.footnote.params.showWithoutNikkudot.label');
  const showWithoutNikkudotTooltip = t('pages.footnote.params.showWithoutNikkudot.tooltip');

  const editFootnoteParamsTooltip = t('pages.footnote.params.editFootnotesParam.tooltip');

  const showRecorderLabel = t('pages.footnote.form.buttons.upload_or_record.label');
  const showRecorderTooltip = t('pages.footnote.form.buttons.upload_or_record.tooltip');

  const popconfirmTranslate = {
    title: t("components.popconfirm.titles.delete"),
    okText: t("components.popconfirm.ok"),
    cancelText: t("components.popconfirm.cancel")
  }

  const refButtonTooltip =  <>
                               
                            </>;

  const saveForm = useCallback(() => {
    form.submit();
    onDone && onDone();
  }, [form, onDone]);

  const deleteFootnote = useCallback(async () => {
    await delFootnote();
  }, [delFootnote]);

  const restoreFootnote = useCallback(async () => {
    await removeFromRecycleBin();
  }, [removeFromRecycleBin])

  const deleteAudio = useCallback(() => {
    removeAudio();
  }, [removeAudio]);

  useEffect(() => {
    if (id !== undefined && id !== "new") {
      loadFootnoteById(id);
    }
  }, [id]);

  return (
    <>
      <Spin spinning={!formState.didLoaded}>
        <HebForm form={form}
                 onFinish={saveFootnote}
                 onFieldsChange={handleFootnoteChange}
                 layout="vertical"
                 validateMessages={{
                   required: (...args: string[]) => t(`errors.required`, {
                     fieldName: t(`pages.footnote.form.${args[0].replace(/\[\d+\]/g, "")}.label`).toLowerCase()
                   })
                 }}>
          <HebPageHeader className="footnote-page-header heb-page-header"
                         style={{width: "100%", margin: 0, padding: 0}}
                         ghost={!formState.didLoaded}
                         title={
                           <Row className="heb-control" gutter={[19, 19]} style={{width: "100%"}}>
                             <Col flex="1" hidden={formState.isNewFootnote}>
                               <HebPopconfirm placement="bottomLeft"
                                           onConfirm={deleteFootnote}
                                           title={t("components.popconfirm.titles.delete")}
                                           okText={t("components.popconfirm.ok")}
                                           cancelText={t("components.popconfirm.cancel")}>
                    <HebButton
                      viewType="default"
                      buttonSize="small"
                      block
                      style={{minWidth: "3.5rem"}}
                      disabled={formState.isNewFootnote}
                      icon={<DeleteOutlined/>}/>
                  </HebPopconfirm>
                </Col>
                <Col
                  flex="1"
                  hidden={!footnote.toRecycleBin}
                >
                  <HebTooltip
                    placement="bottomLeft"
                    title={nl2br(restoreButtonTooltip)}
                  >
                    <HebButton
                      block
                      viewType="default"
                      buttonSize="small"
                      style={{minWidth: 56}}
                      onClick={restoreFootnote}
                      disabled={formState.isNewFootnote}
                      icon={<RollbackOutlined/>}
                    />
                  </HebTooltip>
                </Col>
                <Col
                  flex="1"
                  hidden={formState.isNewFootnote}
                >
                  <HebTooltip
                    placement="bottomLeft"
                    title={nl2br(shareButtonTooltip)}
                  >
                    <HebButton
                      block
                      style={{minWidth: 56}}
                      viewType="default"
                      buttonSize="small"
                      onClick={shareFootnote}
                      disabled={formState.isNewFootnote}
                      icon={<ShareAltOutlined/>}/>
                  </HebTooltip>
                </Col>
                <Col flex="1">
                  <HebTooltip
                    placement="bottom"
                    title={editFootnoteParamsTooltip}
                  >
                    <HebButton
                      style={{minWidth: 56}}
                      block
                      viewType={isEditMode
                            ? "primary-v2"
                            : "default"
                      }
                      buttonSize="small"
                      onClick={() => {
                        setIsEditMode(oldState => !oldState);
                      }}
                      icon={<SettingOutlined/>}/>
                  </HebTooltip>
                </Col>
                <Col
                  flex="1"
                  hidden={formState.isNewFootnote}
                >
                  <HebTooltip
                    placement="bottom"
                    visible={false}
                    title={refButtonTooltip}
                  >
                    <HebButton block
                               viewType="default"
                               style={{minWidth: 56}}
                               buttonSize="small" onClick={() => setIsTourOpen(true)}
                               icon={<QuestionCircleOutlined/>}/>
                  </HebTooltip>
                </Col>
              </Row>
            }>
            <FootnoteParamsPanel isEditMode={isEditMode}/>
          </HebPageHeader>
          <HebForm.Item
            label={
              <h3 style={{marginRight: 5}}>
                {footnoteWordLabel}&nbsp;&nbsp;
                <HebTooltip title={showWithoutNikkudotTooltip}>
                  <HebSwitch className="show-without-nikkudot"
                             title={showWithoutNikkudotLabel}
                             checked={!formState.showWithoutNikkudot}
                             onChange={(checked) => updateFromStateField("showWithoutNikkudot", !checked)}/>
                </HebTooltip>
              </h3>
            }
            className="word"
            tooltip={footnoteWordTooltip}
            style={{margin: "0px 1.5rem"}}>
            <Row gutter={8}>
              <Col xs={24} hidden={formState.showWithoutNikkudot}>
                <HebForm.Item required={true}
                              rules={[{required: true}]}
                              form={form}
                              name={`word.he_nikkudot`}
                              labelCol={{span: 24, style: {marginLeft: "auto"}}}
                              initialValue={footnote.word.he_nikkudot}>
                  <HebInput cssType="circled"
                            lang="he"
                            dir="rtl"
                            size="large"
                            style={{unicodeBidi: "isolate-override"}}
                            placeholder={t(`pages.footnote.form.word.he_nikkudot.placeholder`)}/>
                </HebForm.Item>
              </Col>
              <Col
                flex="1"
                hidden={!formState.showWithoutNikkudot}
              >
                <HebForm.Item name={`word.he`}
                              labelCol={{span: 24, style: {marginLeft: "auto"}}}
                              initialValue={footnote.word.he}
                              form={form}>
                  <HebInput
                    cssType="circled"
                    lang="he"
                    dir="rtl"
                    size="large"
                    style={{unicodeBidi: "isolate-override"}}
                    placeholder={t(`pages.footnote.form.word.he.placeholder`)}/>
                </HebForm.Item>
              </Col>
            </Row>
          </HebForm.Item>
          <HebForm.Item label={<h3>{footnoteWordMeaningLabel}</h3>}
                        tooltip={footnoteWordMeaningTooltip}
                        style={{margin: "0px 1.5rem"}}
                        className="wordMeaning">
            <Row gutter={8}>
              <Col xs={24}
                   hidden={!formState.showWithoutNikkudot}>
                <HebForm.Item name="wordMeaning.he"
                              labelCol={{span: 24, style: {marginRight: "auto"}}}
                              initialValue={footnote.wordMeaning.he}
                              form={form}
                              label={t(`pages.footnote.form.wordMeaning.he.label`)}>
                  <HebTextArea dir="rtl"
                               lang="he"
                               rows={4}
                               style={{unicodeBidi: "isolate-override", color: "#000"}}
                               placeholder={t(`pages.footnote.form.wordMeaning.he.placeholder`)}/>
                </HebForm.Item>
              </Col>
              <Col xs={24}
                   hidden={formState.showWithoutNikkudot}>
                <HebForm.Item name="wordMeaning.he_nikkudot"
                              labelCol={{span: 24, style: {marginRight: "auto"}}}
                              initialValue={footnote.wordMeaning.he_nikkudot}
                              form={form}
                              label={t(`pages.footnote.form.wordMeaning.he_nikkudot.label`)}>
                  <HebTextArea dir="rtl"
                               lang="he"
                               rows={4}
                               style={{unicodeBidi: "isolate-override", color: "#000"}}
                               placeholder={t(`pages.footnote.form.wordMeaning.he_nikkudot.placeholder`)}/>
                </HebForm.Item>
              </Col>
              <Col xs={24}
                   hidden={defaultLang ? !formState.showAllFields && defaultLang !== LanguageCode.EN
                                       : !formState.showAllFields && translate !== LanguageCode.EN}>
                <HebForm.Item name={`wordMeaning.en`}
                              labelCol={{span: 24, style: {marginRight: "auto"}}}
                              initialValue={footnote.wordMeaning.en}
                              form={form}
                              label={t(`pages.footnote.form.wordMeaning.en.label`)}>
                  <HebTextArea rows={4}
                               style={{unicodeBidi: "isolate-override", color: "#000"}}
                               placeholder={t(`pages.footnote.form.wordMeaning.en.placeholder`)}/>
                </HebForm.Item>
              </Col>
              <Col xs={24} hidden={defaultLang ? !formState.showAllFields && defaultLang !== "ru" : !formState.showAllFields && translate !== "ru"}>
                <HebForm.Item name={`wordMeaning.ru`}
                              labelCol={{span: 24, style: {marginRight: "auto"}}}
                              initialValue={footnote.wordMeaning.ru}
                              form={form}
                              label={t(`pages.footnote.form.wordMeaning.ru.label`)}>
                  <HebTextArea style={{unicodeBidi: "isolate-override", color: "#000"}}
                               placeholder={t(`pages.footnote.form.wordMeaning.ru.placeholder`)}/>
                </HebForm.Item>
              </Col>
              <Col
                xs={24}
                hidden={defaultLang ? !formState.showAllFields && defaultLang !== "fr"
                                    : !formState.showAllFields && translate !== "fr"}
              >
                <HebForm.Item name={`wordMeaning.fr`}
                              labelCol={{span: 24, style: {marginRight: "auto"}}}
                              initialValue={footnote.wordMeaning.fr}
                              form={form}
                              label={t(`pages.footnote.form.wordMeaning.fr.label`)}>
                  <HebTextArea style={{unicodeBidi: "isolate-override", color: "#000"}}
                               placeholder={t(`pages.footnote.form.wordMeaning.fr.placeholder`)}/>
                </HebForm.Item>
              </Col>
            </Row>
          </HebForm.Item>
          <HebForm.Item label={<h3>{footnoteAudioLabel}</h3>}
                        tooltip={footnoteAudioTooltip}
                        style={{margin: "0px 1.5rem"}}
                        className="audio">
            <Row gutter={[8, 8]}>
              <Col xs={!footnote?.audio ? 24 : 0}>
                <HebForm.Item>
                  <HebTooltip placement="top" title={showRecorderTooltip}>
                    <HebButton
                      block
                      onClick={() => setIsVisibleRecorder(true)}
                    >
                      {showRecorderLabel}
                    </HebButton>
                  </HebTooltip>

                  <RecorderModal visible={isVisibleRecorder} onClose={() => setIsVisibleRecorder(false)} onDone={file => {
                    setIsVisibleRecorder(false);
                    addAudioToFootnote(file);
                  }}/>
                </HebForm.Item>
              </Col>
              <Col
                xs={footnote?.audio ? 24 : 0}
              >
                <StandardAudioComponent dataId={footnote?.audio}/>
              </Col>
              <Col xs={footnote?.audio ? 24 : 0}>
                <HebPopconfirm
                  placement="topRight"
                  onConfirm={deleteAudio}
                  {...popconfirmTranslate}
                >
                  <HebButton block
                             icon={<DeleteOutlined/>}/>
                </HebPopconfirm>
              </Col>
            </Row>
          </HebForm.Item>
          <Divider/>
          <HebForm.Item name="externalReference"
                        className="externalReference"
                        style={{margin: "0px 1.5rem"}}
                        label={footnoteExternalReferenceLabel}
                        tooltip={footnoteExternalReferenceTooltip}
                        initialValue={footnote?.externalReference}
                        form={form}>
            <HebInput
              cssType="circled"/>
          </HebForm.Item>
          <HebForm.Item style={{margin: "1.5rem"}}>
            <Row justify="end">
              <Col xs={24} md={12}>
                <Row gutter={8}>
                  <Col flex="auto">
                    <HebTooltip title={nl2br(saveButtonTooltip)}>
                      <HebButton block
                                 overText={false}
                                 disabled={!isValid}
                                 viewType="primary"
                                 onClick={saveForm}
                                 icon={<SaveOutlined/>}>
                        {nl2br(saveButtonLabel)}
                      </HebButton>
                    </HebTooltip>
                  </Col>
                </Row>
              </Col>
            </Row>
          </HebForm.Item>
        </HebForm>
      </Spin>
      <FootnoteFormTour {...{isOpen: isTourOpen, onRequestClose: () => setIsTourOpen(false)}}/>
    </>
  );
};