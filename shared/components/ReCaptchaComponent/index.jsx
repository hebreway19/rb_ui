import React from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { StorageKey } from "../../../constants";

const siteKey = "6LeccigaAAAAACblXM2UAjwL_vTMWFQ4HJb4z_GZ";

export const ReCaptchaComponent = ({callback = () => {}}) => {
    return <ReCAPTCHA theme={localStorage.getItem(StorageKey.THEME)} siteKey={siteKey} onChange={callback} />
}