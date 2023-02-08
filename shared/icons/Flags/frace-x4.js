import React from "react";
import Icon from "@ant-design/icons";

const FranceX4Svg = () => (
    <svg width="2em" height="2em" fill="currentColor" viewBox="0 0 496 496">
        <rect x="160" y="80" style={{fill:"#FFFFFF"}} width="176" height="336"/>
            <path style={{fill:"#3757A6"}} d="M160,80H48C21.6,80,0,99.2,0,126.4v243.2C0,396.8,21.6,416,48,416h112V80z"/>
            <path style={{fill:"#EF4F4E"}} d="M448,80H336v336h112c26.4,0,48-19.2,48-46.4V126.4C496,99.2,474.4,80,448,80z"/>
            <path style={{fill:"#DD4545"}} d="M448,80H336v240.8L446.4,416c26.4,0,49.6-19.2,49.6-46.4V126.4C496,99.2,474.4,80,448,80z"/>
            <polygon style={{fill:"#E2F2F1"}} points="336,320.8 336,80 160,80 160,175.2 "/>
            <polygon style={{fill:"#2A4D93"}} points="160,80 48,80 160,175.2 "/>
            <path style={{fill:"#CC3E3E"}} d="M336,416h112c26.4,0,48-16,48-48H336V416z"/>
            <rect x="160" y="368" style={{fill:"#D6EAE8"}} width="176" height="48"/>
            <path style={{fill:"#133970"}} d="M0,368c0,32,21.6,48,48,48h112v-48H0z"/>
            <path style={{fill:"#CC3E3E"}} d="M448,80H336v84.8l160,49.6v-88C496,99.2,474.4,80,448,80z"/>
            <polygon style={{fill:"#D6EAE8"}} points="336,164.8 336,80 160,80 160,112.8 "/>
            <polygon style={{fill:"#133970"}} points="160,80 48,80 160,112.8 "/>
            <g></g><g></g><g></g>
            <g></g><g></g><g></g>
            <g></g><g></g><g></g>
            <g></g><g></g><g></g>
            <g></g><g></g><g></g>
    </svg>
);

export const FranceX4Icon = props => <Icon component={FranceX4Svg}  {...props} />

 FranceX4Icon;