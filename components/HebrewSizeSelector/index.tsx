import React, { useCallback } from "react";
import { HebRadio } from "../HebElements/HebRadio";
import { useTranslation } from "next-i18next";
import { useFontFamily } from "../../shared/hooks";
import { ComponentSize } from "../../constants";

export const HebrewSizeSelector = ({isMobile = false}) => {
  const {t} = useTranslation();
  const {fontSize, changeFontSize} = useFontFamily();
  
  const handleClick = useCallback(async e => {
    await changeFontSize(e.target.value);
  }, [changeFontSize]);
  
  return (
    <HebRadio.Group buttonStyle="solid" defaultValue={fontSize}>
      <HebRadio.Button paddingSize="small"
                       style={isMobile ? {width: "100%", marginBottom: 7, marginRight: 0} : {marginRight: 7}}
                       value={ComponentSize.SMALL.name}
                       onClick={handleClick}>
        {t("constants.size.small")}
      </HebRadio.Button>
      <HebRadio.Button paddingSize="small"
                       style={isMobile ? {width: "100%", marginBottom: 7, marginRight: 0} : {marginRight: 7}}
                       value={ComponentSize.DEFAULT.name}
                       onClick={handleClick}>
        {t("constants.size.default")}
      </HebRadio.Button>
      <HebRadio.Button paddingSize="small"
                       style={isMobile ? {width: "100%", marginRight: 0} : {}}
                       value={ComponentSize.LARGE.name}
                       onClick={handleClick}>
        {t("constants.size.large")}
      </HebRadio.Button>
    </HebRadio.Group>
  )
}