import React from "react";
import { Col, Row } from "antd";

import { MemoryCardType } from "../../../../constants";
import { MemoryCard } from "../../../../types";

import { TextBackCard } from "../TextBackCard";
import { MediaBackCard } from "../MediaBackCard";

export const BackCardBuilder: any = {
  [MemoryCardType.TextMemoryCard]: TextBackCard,
  [MemoryCardType.MediaMemoryCard]: MediaBackCard,
  build: (type: MemoryCardType) => BackCardBuilder[type]
}

export type BackCardProps = {
  card?: MemoryCard;
  customBody?: React.ReactNode | React.ReactNode[];
}

export const BackCard = ({ customBody, card }: BackCardProps) => {
  const Component = !customBody && BackCardBuilder.build(card?.__t);
  return (
    customBody ? <>{ customBody }</>
      : <Row style={{height: "100%"}} align="middle">
        <Col xs={24}>
          { Component && <Component content={card.content} /> }
        </Col>
      </Row>
  )
}