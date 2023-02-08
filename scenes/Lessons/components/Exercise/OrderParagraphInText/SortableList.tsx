import React from 'react';
import { HebCard } from "../../../../../components/HebElements";
import { Button, Col, Row } from "antd";
import { UpArrowIcon } from "../../../../../shared/icons/Arrow";
import { TextContent } from "../../../../../types";
import { NumberUtil, StringUtil } from "../../../../../util";

type SortableItemProps = {
  paragraphs: TextContent[];
  isStudent: boolean;
  paragraphId: string;
}

const SortableItem = ({paragraphs, isStudent, paragraphId}: SortableItemProps) => {
  const currentIndexInParagraphs: number = paragraphs.findIndex((item) => paragraphId === item._id);
  const currentParagraphName: string = StringUtil.getUnicodeSymbolByHexadecimal(NumberUtil.convertNumToHexadecimal(currentIndexInParagraphs + 65));
  
  return (
    <HebCard style={{width: "100%", height: "100%", zIndex: 100000}}
             bodyStyle={{padding: 18}}>
      <h3 style={{margin: 0, color: isStudent ? "#000000" : "#ffffff"}}>{currentParagraphName}</h3>
    </HebCard>
  )
};

type SortableListProps = {
  paragraphs: TextContent[];
  paragraphsIds: string[];
  isStudent: boolean;
  onMoveUp?: (id: number) => void;
  onMoveDown?: (id: number) => void;
}

export const SortableList = ({
                               paragraphsIds,
                               paragraphs,
                               isStudent,
                               onMoveUp,
                               onMoveDown
                             }: SortableListProps) => {
  const itemsList = paragraphsIds.map((content, index) => (
    <li key={index} style={{
      listStyleType: "none"
    }}>
      <Row>
        <Col xs={18}>
          <SortableItem isStudent={isStudent} paragraphs={paragraphs} paragraphId={content}/>
        </Col>
        <Col xs={6}>
          <Row>
            <Col xs={24}>
              <Button type="text" disabled={index === 0} onClick={() => onMoveUp(index)}
                      icon={<UpArrowIcon style={{color: index === 0 ? "#ffffff50" : "#fff"}}/>}/>
            </Col>
            <Col xs={24}>
              <Button type="text" disabled={index === paragraphsIds?.length - 1}
                      onClick={() => onMoveDown(index)}
                      icon={<UpArrowIcon style={{
                        color: index === paragraphsIds?.length - 1 ? "#ffffff50"
                          : "#fff", transform: "rotate(180deg)"
                      }}/>}/>
            </Col>
          </Row>
        </Col>
      </Row>
    </li>
  ));
  
  return (
    <Row>
      <Col xs={24}>
        <ul style={{width: "100%"}}>
          {itemsList}
        </ul>
      </Col>
    </Row>
  );
}