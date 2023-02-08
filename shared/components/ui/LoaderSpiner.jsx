import { LoadingOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import React from "react";

export const LoaderSpiner = () => {
    return (
        <Row style={{ minHeight: "calc(100vh - 132px)"}} justify="center" align="middle">
            <Col xs={24} style={{fontSize: "3rem", textAlign: "center"}}>
                <LoadingOutlined />
            </Col>
        </Row>
    );
}

 LoaderSpiner;