import React, { useCallback } from "react";
import { useFontFamily } from "../../hooks";
import { FontFamily } from "../../../constants";
import { HebSelect } from "../../../components/HebElements";

export const ChangeFontComponent = () => {

  const {changeFontFamily, fontFamily} = useFontFamily();

  const handleChange = useCallback(value => {
    changeFontFamily(value);
    process.browser && window.location.reload();
  }, [changeFontFamily]);

  return (
    <HebSelect onChange={handleChange}
               className="change-font-family"
               arrow={false}
               style={{
                 width: "100%",
                 maxWidth: 286,
                 minWidth: 259,
                 textAlign: "center"
               }}
               defaultValue={fontFamily}>
      <HebSelect.Option value={FontFamily.ARIAL.name}>
        {FontFamily.ARIAL.title}
      </HebSelect.Option>
      <HebSelect.Option value={FontFamily.CARDO.name}>
        {FontFamily.CARDO.title}
      </HebSelect.Option>
      <HebSelect.Option value={FontFamily.TIMES_NEW_ROMAN.name}>
        {FontFamily.TIMES_NEW_ROMAN.title}
      </HebSelect.Option>
      <HebSelect.Option value={FontFamily.DAVID_LIBRE.name}>
        {FontFamily.DAVID_LIBRE.title}
      </HebSelect.Option>
    </HebSelect>
  );
};