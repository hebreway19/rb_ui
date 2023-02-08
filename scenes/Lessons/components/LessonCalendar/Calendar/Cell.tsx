import { Col, Row } from "antd";
import React, { useCallback, useState } from "react";
import { CellContent } from "./CellContent";
import { CellPageControl } from "./CellPageControl";
import { DayDetails } from "../Details";

export const Cell = ({day, currentMonth, currentYear, cellData, currentLessonType}) => {
  const [page, setPage] = useState<number>(0);
  const [detailsIsVisible, setDetailsIsVisible] = useState<boolean>(false);

  const showDetails = useCallback(() => setDetailsIsVisible(true), []);
  const hideDetails = useCallback(() => setDetailsIsVisible(false), []);

  let classNameString = "heb-calendar__cell";
  const isHiddenContent = !cellData || cellData.length === 0;
  if (isHiddenContent) {
    classNameString += " empty";
  }
  return (
    <>
      <Col className={classNameString}>
        <Row className="heb-calendar__cell__container">
          <Col
            className="heb-calendar__cell__content"
            onClick={showDetails}
          >
            <Row>
              <Col xs={24} className="heb-calendar__cell__day-container">
                <span className="heb-calendar__cell__day">
                  {day < 10 ? `0${day}` : day}
                </span>
              </Col>
              <Col xs={24} className="heb-calendar__cell__content-container">
                {!isHiddenContent && <CellContent cellData={cellData} page={page}/>}
              </Col>
            </Row>
          </Col>
          <Col className="heb-calendar__cell__controls">
            <CellPageControl setPage={setPage} page={page} total={cellData?.length} />
          </Col>
        </Row>
      </Col>
      <DayDetails
        day={day}
        month={currentMonth}
        year={currentYear}
        currentLessonType={currentLessonType}
        visible={detailsIsVisible}
        onClose={hideDetails}
        lessons={cellData}
      />
    </>
  );
}