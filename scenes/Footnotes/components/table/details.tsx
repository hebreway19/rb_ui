import { DeleteOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Col, Divider, Form, Input, message, Popconfirm, Row, Spin, Switch, Tooltip } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "next-i18next";

import { FileUploadComponent } from "../../../../shared/components";
import { ApiEndpoint } from "../../../../constants";
import { useWordMeaningTranslate } from "../../../../shared/hooks";
import { useFootnoteService } from "../../../../services";
import { StringUtil } from "../../../../util";
import { useShowFields } from "../../../../providers";
import { Footnote } from "../../../../types";
import { HebTypography } from "../../../../components/HebElements";

export const FootnotesTableDetails = ({
                                        id,
                                        isVisible,
                                        updateDisplayDataTable,
                                        onClose,
                                        updateFileField,
                                        ...props
                                      }) => {
  const footnoteService = useFootnoteService();
  const {translate} = useWordMeaningTranslate();
  const {isShowFields, updateIsShowFields} = useShowFields();
  const {Title} = HebTypography;
  const {t} = useTranslation();

  const [currentFootnotes, setCurrentFootnotes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isShowWithoutNikkudot, setIsShowWithoutNikkudot] = useState(false);

  const [form] = Form.useForm();

  const updateCurrentFootnotes = useCallback(async () => {
    footnoteService.getFootnoteById(id)
      .then(footnote =>  {
        setCurrentFootnotes(footnote);
        setIsLoading(false);
      })
  }, [id, footnoteService])

  const uploadFile = useCallback(async filename => {
    setIsLoading(true);
    const updatedFootnoteData = {
      audio: filename._id
    };
    try {
      await footnoteService.updateFootnote(currentFootnotes._id, updatedFootnoteData);
      message.info(t("info_updat_was_successful"));
    } catch (err) {
      message.warn(t("errors.bad_request"));
    }
    setIsLoading(false);
  }, [t, footnoteService, currentFootnotes]);

  const onFinish = useCallback(async (values) => {
    setIsLoading(true);
    const updatedFootnoteData: Footnote = {
      word: {
        he: (values?.wordHe || StringUtil.removeNikkudots(values.wordHeNikkudot)) || currentFootnotes?.word?.he,
        he_nikkudot: values.wordHeNikkudot || currentFootnotes?.word?.he_nikkudot,
      },
      wordMeaning:  {
        ru: values.wordMeaningRu || currentFootnotes.wordMeaning?.ru,
        fr: values.wordMeaningFr || currentFootnotes.wordMeaning?.fr,
        en: values.wordMeaningEn || currentFootnotes.wordMeaning?.en
      }
    };
    try {
      await footnoteService.updateFootnote(currentFootnotes._id, updatedFootnoteData);
      await updateCurrentFootnotes();
      message.info(t("info_updat_was_successful"));
      onClose && onClose();
    } catch (err) {
      message.warn(t("errors.bad_request"));
    }
    await updateDisplayDataTable();
    setIsLoading(false);
  }, [updateDisplayDataTable, t, currentFootnotes, updateCurrentFootnotes, onClose, footnoteService]);

  const deleteFootnote = useCallback(async () => {
    setIsLoading(true);
    try {
      await footnoteService.deleteById(currentFootnotes?._id);
      await updateCurrentFootnotes();
      message.info(t("info_updat_was_successful"));
      onClose && onClose();
    } catch (err) {
      message.warn(t("errors.bad_request"));
    }
    await updateDisplayDataTable();
    setIsLoading(false);
  }, [currentFootnotes, updateDisplayDataTable, t, updateCurrentFootnotes, onClose, footnoteService]);

  useEffect(() => {
    updateCurrentFootnotes()
  }, [id]);

  useEffect(() => {
    form.setFieldsValue({
      wordHe: currentFootnotes?.word?.he,
      wordHeNikkudot: currentFootnotes?.word?.he_nikkudot,
      wordMeaningRu: currentFootnotes?.wordMeaning?.ru,
      wordMeaningEn: currentFootnotes?.wordMeaning?.en,
      wordMeaningFr: currentFootnotes?.wordMeaning?.fr,
    })
  }, [currentFootnotes]);

  const layout =  {
    labelCol: { xs: 24 },
    wrapperCol: { xs: 24 },
  };

  const editForm =  <>
    <Row>
      <Title  level={4} >
        {t("pages.footnote_list.details.titles.editing")}
      </Title>
    </Row>
    <Form {...layout}
          size="large"
          form={form}
          labelAlign="left"
          onFinish={onFinish} >
      <Row>
        <Col  xs={24}
              style={{marginBottom: 10}} >
          <Alert  message={t("pages.footnote_list.details.alerts.from_description")}
                  type="warning" />
        </Col>
      </Row>
      <Row  align="top"
            justify="space-between"
            style={{marginBottom: "1rem"}} >
        <Col>
          <Row gutter={16}>
            <Col>{t("pages.footnote_list.controlls.show_all_fields")}</Col>
            <Col>
              <Switch defaultChecked={isShowFields}
                      onChange={updateIsShowFields} />
            </Col>
          </Row>
        </Col>
        <Col>
          <Tooltip  title={t("pages.footnote_list.controlls.show_without_nikkudot")}
                    placement="top" >
            <Switch checked={isShowWithoutNikkudot}
                    onChange={setIsShowWithoutNikkudot}
                    checkedChildren={"א"}
                    unCheckedChildren={"אָ"} />
          </Tooltip>
        </Col>
      </Row>
      <Row>
        <Col  xs={24}>
          {
            isShowWithoutNikkudot
              ? <Form.Item  name="wordHe"
                            label={t("pages.footnote_list.table.title.word.he")}
                            style={{marginBottom: 0}}
                            labelAlign="right" >
                <Input  lang="he"
                        dir="rtl"
                        style={{fontSize: "1.3rem !important"}}
                        defaultValue={currentFootnotes?.word?.he} />
              </Form.Item>
              : <Form.Item  name="wordHeNikkudot"
                            label={t("pages.footnote_list.table.title.word.he_nikkudot")}
                            style={{marginBottom: 0}}
                            labelAlign="right" >
                <Input  lang="he"
                        dir="rtl"
                        style={{fontSize: "1.3rem !important"}}
                        defaultValue={currentFootnotes?.word?.he_nikkudot} />
              </Form.Item>
          }
        </Col>
      </Row>

      {
        (translate === 'en' || isShowFields)
        &&  <Row>
          <Col  xs={24}>
            <Form.Item  name="wordMeaningEn"
                        label={t("pages.footnote_list.table.title.word_meaning.en")}
                        style={{marginBottom: 0}} >
              <Input.TextArea defaultValue={currentFootnotes?.wordMeaning?.en}
                              autoSize={{minRows: 5, maxRows: 5}} />
            </Form.Item>
          </Col>
        </Row>
      }
      {
        (translate === 'fr' || isShowFields)
        &&  <Row>
          <Col  xs={24}>
            <Form.Item  name="wordMeaningFr"
                        label={t("pages.footnote_list.table.title.word_meaning.fr")}
                        style={{marginBottom: 0}} >
              <Input.TextArea defaultValue={currentFootnotes?.wordMeaning?.fr}
                              autoSize={{minRows: 5, maxRows: 5}} />
            </Form.Item>
          </Col>
        </Row>
      }
      {
        (translate === 'ru' || isShowFields)
        &&  <Row>
          <Col  xs={24}>
            <Form.Item  name="wordMeaningRu"
                        label={t("pages.footnote_list.table.title.word_meaning.ru")}
                        style={{marginBottom: 0}} >
              <Input.TextArea defaultValue={currentFootnotes?.wordMeaning?.ru}
                              autoSize={{minRows: 5, maxRows: 5}} />
            </Form.Item>
          </Col>
        </Row>
      }
      <Row>
        <Col xs={24}>

        </Col>
        <Form.Item style={{marginBottom: 0, marginTop: "1rem"}}>
          <FileUploadComponent  maxCountFileList={1}
                                onDone={uploadFile} />
        </Form.Item>
      </Row>
      <Row  gutter={ 16 }
            style={{marginTop: "1rem"}} >
        <Col xs={8}>
          <Form.Item>
            <Tooltip  title={t("pages.footnote_list.controlls.tooltips.edit_cancel")}
                      placement="top" >
              <Button block
                      onClick={onClose}
                      size="large" >
                {t("pages.footnote_list.controlls.edit_cancel")}
              </Button>
            </Tooltip>
          </Form.Item>
        </Col>
        <Col xs={16}>
          <Form.Item>
            <Tooltip  title={t("pages.footnote_list.controlls.tooltips.apply")}
                      placement="top" >
              <Button block
                      type="primary"
                      htmlType="submit" >{t("pages.footnote_list.controlls.apply")}</Button>
            </Tooltip>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </>

  return  <Spin spinning={isLoading}>
    {
      !isLoading
      &&  <>
        <Row style={{marginTop: "1rem"}}>
          <Col xs={24}>
            <Title level={3}
                   lang="he"
                   dir="rtl"
                   style={{textAlign: "right"}}>
              {currentFootnotes?.word?.he}
            </Title>
          </Col>
        </Row>
        { editForm }
        <Divider />
        <Row>
          <Title  level={4} >
            <Avatar src={`${ApiEndpoint.FILE}/download/${currentFootnotes?.author?.photoUrl}`}
                    style={{ marginRight: "1rem" }} />
            {t("pages.footnote_list.details.titles.author")}: {currentFootnotes?.author?.firstname} {currentFootnotes?.author?.surname}
          </Title>
        </Row>
        <Divider />
        <Row>
          <Title  level={4} >{t("pages.footnote_list.details.titles.controlls")}</Title>
        </Row>
        <Row style={{ marginBottom: "1rem" }}>
          <Col xs={24}>

          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Tooltip  title={t("pages.footnote_list.controlls.tooltips.delete")}
                      placement="top" >
              <Popconfirm placement="bottom"
                          title={t("pages.footnote_list.controlls.popconfirm.delete.title")}
                          onConfirm={deleteFootnote}
                          okText={t("pages.footnote_list.controlls.popconfirm.delete.yes")}
                          cancelText={t("pages.footnote_list.controlls.popconfirm.delete.no")} >
                <Button danger
                        block
                        size="large" >
                  <DeleteOutlined /> {t("pages.footnote_list.controlls.delete")}
                </Button>
              </Popconfirm>
            </Tooltip>
          </Col>
        </Row>
      </>
    }
  </Spin>
}