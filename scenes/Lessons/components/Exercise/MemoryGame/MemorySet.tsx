import { DeleteOutlined, FileOutlined, FontSizeOutlined, PictureOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import { useTranslation } from "next-i18next";
import React, { useCallback, useEffect, useState } from "react";
import { HebButton } from "../../../../../components/HebElements/HebButton";
import { HebInput } from "../../../../../components/HebElements/HebInput";
import { HebPopconfirm } from "../../../../../components/HebElements/HebPopconfirm";
import { MemoryCard as MemoryCardComponent } from "../../../../../components/Memory";
import { MemoryCardType, TaskContentType } from "../../../../../constants";
import { MediaContent, MemoryCard, MemorySet as MemorySetType, TextContent } from "../../../../../types";
import { CustomCardContent } from "./CustomCardContent";

type ErrorSet = { setIndex: number, errors: string[] };

export type MemoryProps = {
  memorySet: MemorySetType,
  currentSetErrors: number[],
  onUpdateCurrentSet(setContent: MemorySetType): void
  onRemoveCurrentSet(): void
}

type AddMemoryCardComponentProps = {
  cards: MemoryCard[],
  onCreateNewCard: (cardType: MemoryCardType, memoType?: string) => () => void,
}

const AddMemoryCardComponent = ({cards = [], onCreateNewCard}: AddMemoryCardComponentProps) => {
  const getExistedCardLengthByCardType = useCallback((cardType: MemoryCardType, mimeType?: string) => {
    let filteredCardsList: MemoryCard[] = cards.filter((card) => {
      if (mimeType && (card.content as MediaContent)?.mimeType) {
        return `${card.__t}${(card.content as MediaContent)?.mimeType.substring(0, 5)}` === `${cardType}${mimeType}`;
      } else {
        return `${cardType}` === `${card.__t}`;
      }
    });
    return filteredCardsList.length;
  }, [cards]);
  return (
    <MemoryCardComponent isOpen={true}
                         customBody={
      <Row style={{height: "100%"}} justify="center" align="middle">
        <Col xs={24}>
          <Row gutter={[8, 8]}>
            <Col xs={12}
                 hidden={getExistedCardLengthByCardType(MemoryCardType.TextMemoryCard) > 0}>
              <Button onClick={onCreateNewCard(MemoryCardType.TextMemoryCard)} type="text">
                <FontSizeOutlined />
              </Button>
            </Col>
            <Col xs={12}
                 hidden={getExistedCardLengthByCardType(MemoryCardType.TextMemoryCard) > 1}>
              <Button onClick={onCreateNewCard(MemoryCardType.TextMemoryCard)} type="text">
                <FontSizeOutlined />
              </Button>
            </Col>
            <Col xs={12}
                 hidden={getExistedCardLengthByCardType(MemoryCardType.MediaMemoryCard, "image") > 0}>
              <Button onClick={onCreateNewCard(MemoryCardType.MediaMemoryCard, "image")} type="text">
                <PictureOutlined />
              </Button>
            </Col>
            <Col xs={12}
                 hidden={getExistedCardLengthByCardType(MemoryCardType.MediaMemoryCard, "audio") > 0}>
              <Button onClick={onCreateNewCard(MemoryCardType.MediaMemoryCard, "audio")} type="text">
                <FileOutlined />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    } />
  )
}

export const MemorySet = ({ memorySet, onUpdateCurrentSet, onRemoveCurrentSet, currentSetErrors }: MemoryProps) => {
  const { t } = useTranslation();
  const [currentSet, setCurrentSet] = useState<MemorySetType>({ cards: [], title: "" });
  
  const updateTitle = useCallback(({ target: { value } }) => {
    setCurrentSet( oldState => ({...oldState, title: value}))
  }, []);
  const updateCardByIndex = useCallback((index: number) => (values: Partial<MemoryCard>) => {
    setCurrentSet(oldState => {
      const newCardList: MemoryCard[] = oldState.cards;
      newCardList[index] = { ...oldState.cards[index], ...values };
      return ({...oldState, cards: newCardList });
    });
  }, []);
  const createNewCard = useCallback((cardType: MemoryCardType, mimeType?: string) => () => {
    setCurrentSet(oldState => {
      let newCard: MemoryCard = { __t: cardType, isEnabled: true } as MemoryCard;
      if (mimeType) {
        newCard.content = { mimeType, __t: TaskContentType.MediaContent } as MediaContent;
      } else {
        newCard.content = { he_nikkudot: "", he: "", __t: TaskContentType.TextContent } as TextContent;
      }
      let newCards: MemoryCard[] = oldState.cards;
      newCards.push(newCard);
      return ({...oldState, cards: newCards});
    });
  }, []);
  const removeCardByIndex = useCallback((currentIndex: number) => () => {
    setCurrentSet(oldState => {
      let newCards = oldState.cards.filter((_, index) => index !== currentIndex);
      return ({...oldState, cards: newCards});
    })
  }, [])
  
  const popconfirmTitle: string = t("actions.remove.entity", { entity: t("entities.set").toLowerCase() }) + ". " +
                                  t("tooltips.are_you_sure");
  const popconfirmCancelLabel: string = t("tooltips.no");
  const popconfirmOkLabel: string = t("tooltips.yes");
  
  useEffect(() => {
    setCurrentSet(memorySet);
  }, []);
  
  useEffect(() => {
    onUpdateCurrentSet && onUpdateCurrentSet(currentSet);
  }, [currentSet]);
  
  return (
    <Row gutter={[8, 8]}>
      <Col xs={24}>
        <Row gutter={8}>
          <Col xs={20}>
            <HebInput cssType="primary" defaultValue={currentSet?.title} value={currentSet?.title} onChange={updateTitle} lang="he" dir="rtl" />
          </Col>
          <Col xs={4}>
            <HebPopconfirm title={popconfirmTitle} cancelText={popconfirmCancelLabel}
                           okText={popconfirmOkLabel} onConfirm={onRemoveCurrentSet} >
              <HebButton buttonSize={"small"} style={{width: "100%"}}><DeleteOutlined /></HebButton>
            </HebPopconfirm>
          </Col>
        </Row>
      </Col>
      { currentSet?.cards &&
        currentSet?.cards.length > 0 &&
        currentSet?.cards?.map((cardContent, cardIndex: number) => (
          <Col xs={6} key={cardIndex}>
            <MemoryCardComponent isOpen={cardContent.isEnabled}
                                 isWrong={currentSetErrors?.includes(cardIndex)}
                                 customBody={<CustomCardContent card={cardContent}
                                                                removeCardByIndex={removeCardByIndex(cardIndex)}
                                                                setAnswer={updateCardByIndex(cardIndex)} />} />
          </Col>
        ))
      }
      <Col xs={6} hidden={currentSet.cards.length >= 4}>
        <AddMemoryCardComponent cards={currentSet.cards} onCreateNewCard={createNewCard} />
      </Col>
    </Row>
  )
}