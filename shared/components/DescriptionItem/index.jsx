import { Typography } from "antd";
import React from "react";

export const DescriptionItem = ({ title, content }) => <>
                                                        <Typography.Text strong>{title}: </Typography.Text>
                                                        <Typography.Text>{content}</Typography.Text>
                                                      </>

 DescriptionItem;