import React from "react";
import { Col, Row } from "antd";
import { MemoryCard } from "../../../../../components/Memory/MemoryCard";
import { MemoryCard as MemoryCardType } from "../../../../../types";

type CardListProps = {
  cardList: MemoryCardType[],
  isCorrect?: boolean,
  isWrong?: boolean
}

export const CardList = ({cardList, isWrong}: CardListProps) => {
  return (
    <Row gutter={8}>
      {cardList.map((card, index) => (
          <Col xs={6} key={index}>
            <MemoryCard card={card} isOpen={true} isWrong={isWrong} />
          </Col>
        ))}
    </Row>
  )
}