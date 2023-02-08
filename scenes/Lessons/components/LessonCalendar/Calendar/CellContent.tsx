import React, { useEffect, useState } from "react";
import { Badge, Col, Row } from "antd";

const HebrewProficiencyColors = {
  alef: "#1abd25",
  bet: "#1abd87",
  gimel: "#8c1abd",
  dalet: "#bd1a4b"
}

const hideOverText = (text: string) => {
  return (
    <span>
      { text?.length > 10
        ? `${text.substring(0, 10)}...`
        : text
      }
    </span>
  );
}

export const CellContent = ({cellData, page = 0}) => {
  const [cellDataPage, setCellDataPage] = useState([]);
  useEffect(() => {
    let newCellData = [];
    for (let i = page * 3; i < (page * 3) + 3; i++) {
      newCellData.push(cellData[i]);
    }
    setCellDataPage(newCellData);
  }, [page, cellData]);
  return (
    <Row>
      { cellDataPage.map((lesson) => (
        <Col xs={24}
             dir="rtl">
          <Badge
            color={HebrewProficiencyColors[lesson?.studentsHebrewProficiency]}
            text={hideOverText(lesson?.title?.he_nikkudot || lesson?.title?.he)}
          />
        </Col>
      ))
      }
    </Row>
  );
}