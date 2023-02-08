import React, { useEffect, useState } from "react";
import { Carousel } from "antd-mobile";
import { Button, Card, Col, Row, Spin, Tooltip } from "antd";
import Meta from "antd/lib/card/Meta";
import { useTranslation } from "next-i18next";
import { DataEntryForUlpan } from "../index";
import { InfoCircleOutlined, PlayCircleTwoTone } from "@ant-design/icons";
import { UlpanService } from "../../../services";
import { UlpanState } from "../../../constants";

type CardCarouselProps = {
  height?: number;
  maxWidth?: string;
  cellSpacing?: number;
  slideWidth?: number;
  autoplay?: boolean;
  setIsOneUlpan?(isOneUlpan: boolean): void;
}
export const CardCarousel = ({
                               height = 341,
                               maxWidth = "auto",
                               cellSpacing = 10,
                               slideWidth = 0.8,
                               autoplay = false,
                               setIsOneUlpan
                             }: CardCarouselProps) => {

  const {t} = useTranslation();
  const [ulpanId, setUlpanId] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [ulpans, setUlpans] = useState([]);
  const [isOne, setIsOne] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    UlpanService.getAllUlpans()
                .then(ulpans => {
                                  setUlpans(ulpans);
                                  setIsLoaded(true);
                                }, 
                      error => console.error(error));
    setUlpanId(ulpans.length === 1 ? ulpans[0]._id : '');
    setIsOneUlpan && setIsOneUlpan(ulpans.length === 1);
    setIsOne(ulpans.length === 1);
  }, [isLoaded]);

  return   <Spin spinning={!isLoaded}>
            {
              (ulpans && ulpans.length > 1)
              && <Carousel
                frameOverflow="visible"
                style={{minHeight: height}}
                cellSpacing={cellSpacing}
                slideWidth={slideWidth}
                autoplay={autoplay}
                selectedIndex={selectedIndex}
                infinite={false}
              >
                {
                  ulpans.map((ulpan, index) =>
                               ulpan.ulpanState !== UlpanState.PAUSED_DIALING
                               && <Tooltip key={index} placement="bottom" title={t("pages.choose_ulpan.tooltips.card")}>
                                 <Card style={(selectedIndex === (index) && ulpanId)
                                              ? {
                                     backgroundColor: "#1d9c72a1",
                                     maxWidth: maxWidth,
                                     border: "1px solid #0000005e"
                                   }
                                              : {
                                     maxWidth: maxWidth,
                                     border: "1px solid #0000005e"
                                   }
                                 }
                                       hoverable
                                       cover={ulpan?.logoId
                                              ? (<img alt={ulpan?.ulpanName} src={ulpan?.logoId}/>)
                                              : (
                                                <Row justify="center" align="middle" style={{
                                                  width: "100%",
                                                  height: 497.594,
                                                  backgroundColor: "#1d9c72a1"
                                                }}>
                                                  <Col style={{
                                                    fontSize: "5rem",
                                                    padding: 15,
                                                    color: "white"
                                                  }}>
                                                    {ulpan?.ulpanName.toUpperCase()}
                                                  </Col>
                                                </Row>
                                              )
                                       }
                                       onClick={() => {
                                         setSelectedIndex(index);
                                         setUlpanId(ulpan._id);
                                       }}
                                 >
                                   <Meta description={<div style={(selectedIndex === (index) && ulpanId)
                                                                  ? {color: "#ffffff !important"}
                                                                  : {}}>
                                     <h3 style={{textTransform: "uppercase"}}>{ulpan?.ulpanName}</h3>
                                     <div style={{position: "absolute", right: 15, bottom: 20}}>
                                       <Tooltip style={{marginLeft: "auto", marginRight: 0}} placement="top" title={t("card_ulpan_tooltip")}>
                                         <Button className="icon-button" type="text">
                                           <InfoCircleOutlined/>
                                         </Button>
                                       </Tooltip>
                                     </div>
                                     <div style={{position: "absolute", right: "calc(20%)", bottom: "2rem"}}>
                                       <Button className="icon-button icon-audio-button" type="text" disabled>
                                         <PlayCircleTwoTone twoToneColor="#1DA57A"/>
                                       </Button>
                                     </div>
                                   </div>
                                   }
                                   />
                                 </Card>
                               </Tooltip>)}
              </Carousel>
            }
    <Row justify="center" style={{marginTop: "2rem"}}>
      <Col xs={24}>
        {ulpanId && <DataEntryForUlpan id={ulpanId}/>}
      </Col>
    </Row>
  </Spin>
};