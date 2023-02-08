import { Col, Descriptions, Row } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import { useFootnoteForm } from "../../../../providers";
import { HebSwitch } from "../../../../components/HebElements/HebSwitch";

export const FootnoteParamsPanel = ({ isEditMode }) => {
  const {t} = useTranslation();
  const {
    formState, 
    updateFromStateField
  } = useFootnoteForm();

  const footnoteParamsLabel = t('pages.footnote.params.footnotesParam.label');
  const footnoteParamsTooltip = t('pages.footnote.params.footnotesParam.tooltip');

  const showAllFieldsLabel = t('pages.footnote.params.showAllFields.label');

  return  <>
            { isEditMode
              &&  <Descriptions 
                    size="small"
                    column={{xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 3}}
                                layout="vertical"
                                title={
                                  <Row  gutter={4} 
                                        align="middle">
                                          <Col>
                                            <h3 {...{tooltip: footnoteParamsTooltip}}>{footnoteParamsLabel}</h3>
                                          </Col>
                                  </Row>
                                } >
                                  <Descriptions.Item>
                                    <Row gutter={8} >
                                      <Col flex="auto">
                                        <h3>{showAllFieldsLabel}</h3>
                                      </Col>
                                      <Col flex="auto">
                                        <HebSwitch checked={formState.showAllFields}
                                                onChange={(checked) => updateFromStateField("showAllFields", checked)}/>
                                      </Col>
                                    </Row>
                                  </Descriptions.Item>
                  </Descriptions>
            }
          </>
}