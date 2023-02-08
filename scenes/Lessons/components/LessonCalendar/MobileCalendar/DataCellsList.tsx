import { useEffect, useState } from "react";
import { getMonthLength } from "../utils";
import { Col, Row } from "antd";
import { useRouter } from "next/router";

export const DataCellsList = ({daysLocale, setCurrentDay, currentDay, currentYear, currentMonth}) => {
  const router = useRouter();
  const [cells, setCells] = useState<number[]>([]);

  useEffect(() => {
    const monthLength = getMonthLength(currentYear, currentMonth);
    let cellsList = [];
    for (let i: number = 0; i < monthLength; i++) {
      cellsList.push(i);
    }
    setCells(cellsList);
  }, [currentYear, currentMonth]);

  return (
    <Row wrap={false} className="month-list">
      {cells.map(day => (
        <Col key={day + 1} className={currentDay === day + 1 ? "item selected" : "item"} onClick={() => setCurrentDay(day + 1)}>
          <Row>
            <Col xs={24} className="week-day" style={{textAlign: "center"}}>
              {daysLocale[router.locale]
                [
                new Date(currentYear + "-" + (currentMonth + 1) + "-" + (day + 1))
                  .getDay()
                ][0]}
            </Col>
            <Col xs={24} className="month-day" style={{textAlign: "center"}}>
              {day + 1}
            </Col>
          </Row>
        </Col>
      ))}
    </Row>
  );
}