import React from "react";
import classNames from "classnames";
import { MemoryCard as MemoryCardType } from "../../../types";

import { FrontCard } from "./FrontCard";
import { BackCard } from "./BackCard";

export type MemoryCardProps = React.HTMLProps<any> & {
  card?: MemoryCardType,
  customFront?: React.ReactNode | React.ReactNode[],
  customBody?: React.ReactNode | React.ReactNode[],
  isOpen?: boolean,
  isCorrect?: boolean,
  isWrong?: boolean
}

export const MemoryCard = ({
                             card,
                             customFront,
                             customBody,
                             isCorrect,
                             onClick,
                             isWrong,
                             isOpen = false,
                             className = ""
                           }: MemoryCardProps) => {
  const classNamesString = classNames("memory-card",
                                      {'open': isOpen && !isCorrect},
                                      {'isCorrect': isCorrect},
                                      {'isWrong': isWrong},
                                      className.split(" "));
  return (
    <div className={classNamesString}>
      <div className="memory-card-inner" onClick={onClick}>
        <div className="memory-card-front">
          <FrontCard customFront={customFront} />
        </div>
        <div className="memory-card-back">
          <BackCard card={card} customBody={customBody} />
        </div>
      </div>
    </div>
  )
}