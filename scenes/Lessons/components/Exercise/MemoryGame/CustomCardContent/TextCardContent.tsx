import React, { useCallback } from "react";
import { Col, Row } from "antd";
import { HebForm, HebInput } from "../../../../../../components/HebElements";
import { MemoryCard, TextContent } from "../../../../../../types";

export type TextCardContentProps = {
  card: MemoryCard,
  setAnswer;
}

export const TextCardContent = ({card, setAnswer }: TextCardContentProps) => {
  const onChangeHandler = useCallback((fieldName: string) => ({ target: { value } }) => {
    setAnswer({...card, content: {...card.content, [fieldName]: value}});
  }, [setAnswer, card]);
  return (
    <Row style={{height: "100%"}} align="middle" justify="center">
      <Col xs={24}>
        <HebForm.Item initialValue={(card?.content as TextContent)?.he_nikkudot} required={true}
                      rules={[{ required: true }]}>
          <HebInput dir="rtl" lang="he" size="large" cssType="primary"
                    value={(card?.content as TextContent)?.he_nikkudot}
                    onChange={onChangeHandler("he_nikkudot")} />
        </HebForm.Item>
        <HebForm.Item initialValue={(card?.content as TextContent)?.he}
                      required={true} hidden>
          <HebInput dir="rtl" lang="he" size="large" cssType="primary"
                    value={(card?.content as TextContent)?.he}
                    onChange={onChangeHandler("he")} />
        </HebForm.Item>
      </Col>
    </Row>
  )
}