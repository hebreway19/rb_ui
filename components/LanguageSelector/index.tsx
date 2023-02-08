import React, { useCallback } from "react";
import { Radio } from "antd";
import classNames from "classnames";

import { useMediaQuery } from "react-responsive";
import { useLanguage } from "../../providers";

export const LanguageSelector = () => {

  const {language, updateLanguage} = useLanguage();
  const changeLanguage = useCallback((lng) => () => updateLanguage(lng), [updateLanguage]);

  const isTabletOrMobile = useMediaQuery({query: "(max-width: 768px)"});
  const classNameString = classNames({"desktop-radio": !isTabletOrMobile},
    {"mobile-radio": isTabletOrMobile},
    "custom__default__radio-group")
  return (
    <Radio.Group
      className={classNameString}
      value={language}
    >
      <Radio.Button
        value="en"
        onClick={changeLanguage("en")}
      >En</Radio.Button>
      <Radio.Button
        value="fr"
        onClick={changeLanguage("fr")}
      >Fr</Radio.Button>
      <Radio.Button
        value="ru"
        onClick={changeLanguage("ru")}
      >Ru</Radio.Button>
    </Radio.Group>
  )
};