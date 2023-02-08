import React from "react";
import { Col, PageHeader, Row } from "antd";
import classNames from "classnames";

export const HebPageHeader = ({className = "", title, ...props}) => {
  let stylizedTitle = null;
  if (title) {
    let convertedTitle = title;
    if (Array.isArray(title)) {
      convertedTitle = title.join(" ");
    }
    try {
      let wordArray = convertedTitle.split(" ");
      stylizedTitle = wordArray.map((word, index) => (
        index !== 0 ? <span className="mark">{`${word} `}</span>
          : `${word} `
      ))
    } catch (e) {
      stylizedTitle = title;
    }
  }
  const classNameString = classNames("heb-page__header", className.split(" "));
  return (
    <div className="heb-page__header__container">
      <Row justify="center" align="bottom">
        <Col span={22}>
          <PageHeader className={classNameString} title={stylizedTitle} {...props} />
        </Col>
      </Row>
    </div>
  )
}