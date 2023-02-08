import React, { useCallback, useEffect, useState } from "react";
import { UpArrowIcon } from "../../../../../shared/icons";
import { Button, Col, Row } from "antd";

export const CellPageControl = ({setPage, page, total}) => {
  const [prevButtonIsDisabled, setPrevButtonIsDisabled] = useState<boolean>(true);
  const [nextButtonIsDisabled, setNextButtonIsDisabled] = useState<boolean>(true);

  const goToNextPage = useCallback(() => {
    setPage(page + 1);
  }, [page]);
  const goToPrevPage = useCallback(() => {
    setPage(page - 1);
  }, [page]);

  useEffect(() => {
    let isDisabledPrevButton = page === 0;
    let isDisabledNextButton = (page * 3) + 3 > total ;
    let isRequiredTotalLength = total <= 3;
    setNextButtonIsDisabled(isDisabledNextButton || isRequiredTotalLength);
    setPrevButtonIsDisabled(isDisabledPrevButton || isRequiredTotalLength);
  }, [page, total]);

  return (
    <>
      <Row gutter={[0, 0]} style={{height: "50%"}}>
        <Col xs={24}>
          <Button type="text"
                  disabled={prevButtonIsDisabled}
                  onClick={goToPrevPage}
                  block
                  icon={<UpArrowIcon />}
          />
        </Col>
      </Row>
      <Row gutter={[0, 0]} style={{height: "50%"}} align="bottom">
        <Col xs={24}>
          <Button type="text"
                  disabled={nextButtonIsDisabled}
                  onClick={goToNextPage}
                  block
                  icon={<UpArrowIcon style={{transform: "rotate(180deg)"}} />}
          />
        </Col>
      </Row>
    </>
  )
}