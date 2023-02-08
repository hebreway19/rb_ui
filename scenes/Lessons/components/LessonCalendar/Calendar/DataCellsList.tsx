import { Cell } from "./Cell";
import React, { useEffect, useState } from "react";
import { getMonthLength } from "../utils";

export const DataCellsList = ({cellsDataList, currentLessonType, currentYear, currentMonth}) => {
  const [cells, setCells] = useState<number[]>([]);

  useEffect(() => {
    const monthLength = getMonthLength(currentYear, currentMonth);
    let cellsList = [];
    for (let i = 0; i < monthLength; i++) {
      cellsList.push(i);
    }
    setCells(cellsList);
  }, [cellsDataList, currentYear, currentMonth]);

  return (
    <>
      { cells.map(day => <Cell key={day}
                               day={day + 1}
                               currentLessonType={currentLessonType}
                               currentYear={currentYear}
                               currentMonth={currentMonth}
                               cellData={cellsDataList?.[day]} />)
      }
    </>
  );
}