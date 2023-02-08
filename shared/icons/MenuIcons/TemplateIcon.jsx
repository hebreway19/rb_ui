import React from "react";
import Icon from "@ant-design/icons";

const TemplateSvg = () => (
  <svg width="1em"
       height="1em"
       viewBox="0 0 25 29"
       fill="currentColor"
       xmlns="http://www.w3.org/2000/svg">
    <path d="M22.5625 1.0791H2.4375C1.64359 1.0791 1 1.82866 1 2.75328V6.10163C1 7.02625 1.64359 7.7758 2.4375 7.7758H22.5625C23.3564 7.7758 24 7.02625 24 6.10163V2.75328C24 1.82866 23.3564 1.0791 22.5625 1.0791Z"
          stroke="currentColor"
          strokeWidth="2"
          fillOpacity="0"
          strokeLinecap="round"
          strokeLinejoin="round"/>
    <path d="M8.1875 14.4722H2.4375C1.64359 14.4722 1 15.2217 1 16.1463V26.1914C1 27.116 1.64359 27.8656 2.4375 27.8656H8.1875C8.98141 27.8656 9.625 27.116 9.625 26.1914V16.1463C9.625 15.2217 8.98141 14.4722 8.1875 14.4722Z"
          stroke="currentColor"
          strokeWidth="2"
          fillOpacity="0"
          strokeLinecap="round"
          strokeLinejoin="round"/>
    <path d="M15.375 14.4722H24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"/>
    <path d="M15.375 21.1689H24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"/>
    <path d="M15.375 27.8657H24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"/>
  </svg>
);

export const TemplateIcon = props => <Icon component={TemplateSvg}  {...props} />