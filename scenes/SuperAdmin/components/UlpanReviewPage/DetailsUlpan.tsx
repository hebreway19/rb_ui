import { Col, Image, List, Row, Typography } from "antd";
import React from "react";
import { useTranslation } from "next-i18next";
import { Ulpan } from "../../../../types";

export const DetailsUlpan = ({ulpan}) => {
  const {t} = useTranslation();
  const {Title, Link, Paragraph, Text} = Typography;

  return (
    <>
      <Row justify="start">
        <Col xs={24}>
          <Title level={4} style={{marginBottom: 14}}>{t("navs.ulpan_info")}</Title>
        </Col>
      </Row>

      <Row justify="start">
        <Col xs={24} style={{marginBottom: 10}}>
          {
            ulpan?.logoFileId
            ? <Image src={ulpan.logoFileId}/>
            : <Row justify="center" align="middle" style={{width: "100%", height: "100%", maxHeight: 315, backgroundColor: "#1d9c72a1"}}>
              <Col style={{fontSize: "5rem", color: "white"}}>{ulpan?.ulpanName.toUpperCase()}</Col>
            </Row>
          }
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Title level={4}>{ulpan?.ulpanName}</Title>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Paragraph style={{textAlign: "justify"}} ellipsis={{rows: 2, expandable: true, symbol: t("more")}}>
            <Text strong>{t("ulpansfields.short_ulpan_description")}:</Text> {ulpan?.shortUlpanDescription}
          </Paragraph>
        </Col>
      </Row>

      <Row>
        <Col xs={24}>
          <Paragraph style={{textAlign: "justify"}} ellipsis={{rows: 2, expandable: true, symbol: t("more")}}>
            <Text strong>{t("ulpansfields.full_ulpan_description")}:</Text> {ulpan?.fullUlpanDescription}
          </Paragraph>
        </Col>
      </Row>

      <Row>

        <Col xs={24} lg={8}
             className="ulpan_info__contact_col">
          <Title level={5}>{t("register_as_ulpan.inputs.address")}</Title>
          <Paragraph>
            <Text strong>{ulpan?.address.toUpperCase()}</Text>
          </Paragraph>
        </Col>

        <Col xs={24} lg={8}
             className="ulpan_info__contact_col">
          <Title level={5}>{t("register_as_ulpan.inputs.contact_phone")}</Title>
          <Paragraph>
            <Link strong
                  href={`tel:${ulpan?.contactPhone}`}>
              {ulpan?.contactPhone.toUpperCase()}
            </Link>
          </Paragraph>
        </Col>

        <Col xs={24} lg={8}
             className="ulpan_info__contact_col">
          <Title level={5}>{t("register_as_ulpan.inputs.contact_email")}</Title>
          <Paragraph>
            <Link strong target="_blank"
                  href={`mailto:${ulpan?.contactEmail}`}>
              {ulpan?.contactEmail.toUpperCase()}
            </Link>
          </Paragraph>
        </Col>
      </Row>
      <Row>
        <Col xs={24}>
          <List size="small"
                header={<Title level={5}>{t("ulpansfields.fields.title")}</Title>}
                bordered
                dataSource={ulpan?.studentsRequiredFieldsList}
                renderItem={(field: Ulpan) => (
                  <List.Item>
                    <Text strong>{t("ulpansfields.fields.value.en")}:</Text> {field?.caption?.en} <br/>
                    <Text strong>{t("ulpansfields.fields.value.fr")}:</Text> {field?.caption?.fr} <br/>
                    <Text strong>{t("ulpansfields.fields.value.ru")}:</Text> {field?.caption?.ru} <br/>
                    <Text strong>{t("ulpansfields.fields.type")}:</Text> {field.type} <br/>
                  </List.Item>
                )
                }
          />
        </Col>
      </Row>
    </>
  );
};