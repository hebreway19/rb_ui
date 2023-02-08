import React, { useCallback } from "react";
import { HebSelect } from "../HebElements";
import { useFontFamily } from "../../shared/hooks";
import { FontFamily } from "../../constants/FontFamily";

const Option = HebSelect.Option;

export const HebrewStyleSelector = () => {
  const {changeFontFamily, fontFamily} = useFontFamily();
  const handleChange = useCallback(value => {
    changeFontFamily(value);
  }, [changeFontFamily]);
  
  return (
    <HebSelect onChange={handleChange}
               className="change-font-family"
               arrow={false}
               value={fontFamily}
               style={{
                 width: "100%",
                 maxWidth: 286,
                 minWidth: 259,
                 textAlign: "center"
               }}
               defaultValue={fontFamily}>
      <Option value={FontFamily.ARIAL.name}>
        {FontFamily.ARIAL.title}
      </Option>
      <Option value={FontFamily.CARDO.name}>
        {FontFamily.CARDO.title}
      </Option>
      <Option value={FontFamily.TIMES_NEW_ROMAN.name}>
        {FontFamily.TIMES_NEW_ROMAN.title}
      </Option>
      <Option value={FontFamily.DAVID_LIBRE.name}>
        {FontFamily.DAVID_LIBRE.title}
      </Option>
    </HebSelect>
  )
}