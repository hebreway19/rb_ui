import React from "react";
import Icon from "@ant-design/icons";

const SvgIco = () => (
  <svg width="9" height="12" viewBox="0 0 9 12" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M3.35266 1.11741C2.71937 0.522711 1.69261 0.522712 1.05932 1.11741C0.426028 1.71211 0.426028 2.67631 1.05932 3.27101L4.49923 6.50132L1.05917 9.73176C0.42588 10.3265 0.425879 11.2907 1.05917 11.8854C1.69246 12.4801 2.71922 12.4801 3.35251 11.8854L7.92445 7.59201C7.92944 7.58745 7.9344 7.58284 7.93934 7.5782C8.57263 6.9835 8.57263 6.01931 7.93934 5.42461L3.35266 1.11741Z" fill="#F4FFF6"/>
  </svg>
);

const BlueArrow = () => (
  <svg width="1em" height="1em" viewBox="0 0 7 10" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.77135 4.68529L1.13635 0.284043C1.12162 0.272451 1.10393 0.265247 1.08529 0.263258C1.06666 0.261269 1.04784 0.264577 1.031 0.272801C1.01416 0.281024 0.999986 0.293831 0.990097 0.30975C0.980209 0.325668 0.97501 0.344053 0.975099 0.362793V1.32904C0.975099 1.39029 1.00385 1.44904 1.05135 1.48654L5.55135 5.00029L1.05135 8.51404C1.0026 8.55154 0.975099 8.61029 0.975099 8.67154V9.63779C0.975099 9.72154 1.07135 9.76779 1.13635 9.71654L6.77135 5.31529C6.81924 5.27793 6.85799 5.23015 6.88464 5.17556C6.91128 5.12098 6.92514 5.06104 6.92514 5.00029C6.92514 4.93955 6.91128 4.87961 6.88464 4.82503C6.85799 4.77044 6.81924 4.72265 6.77135 4.68529Z" fill="#75ECF9"/>
  </svg>
);

const UpArrow = () => (
  <svg width="1em" height="1em" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.2917 8.38281L7.76926 1.90913L1.24683 8.38281"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"/>
  </svg>
)

const DownArrowSvg = () => (
  <svg xmlns="http://www.w3.org/2000/svg" id="body_1" width="1em" height="1em" viewBox="0 0 16 10" fill="none">
    <defs>
      <clipPath id="1">
        <path id=""
              clip-rule="evenodd"
              transform="matrix(1 0 0 1 0 0)"
              d="M12 -0.5L12 7L12 7L0 7L0 7L0 -0.5L0 -0.5L12 -0.5z" />
      </clipPath>
    </defs>
    <g transform="matrix(1.3333 0 0 1.3333 0 0)">
      <g clip-path="url(#1)" >
        <path id=""
              transform="matrix(1 0 0 -1 0 7)"
              d="M1.2812252 6.2871075L1.2812252 6.2871075L1.2812252 6.2871075L6.173055 1.4318475L6.173055 1.4318475L11.0648775 6.2871075"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="square"
              fill="none" />
      </g>
    </g>
  </svg>
)

export const ArrowIcon = props => <Icon component={SvgIco} {...props} />;
export const BlueArrowIcon = props => <Icon component={BlueArrow} {...props} />;
export const UpArrowIcon = props => <Icon component={UpArrow} {...props} />;
export const DownArrowIcon = props => <Icon component={DownArrowSvg} {...props} />;

 ArrowIcon;