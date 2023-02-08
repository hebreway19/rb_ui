import { HebSelect } from "../../../../../components/HebElements/HebSelect";
import React from "react";

export const CategorySelector = ({ currentValue, categories, setCurrentValue }) => {
  const categoryOptions = categories.map((categoryName) => (
    <HebSelect.Option key={categoryName} value={categoryName}>
      {categoryName}
    </HebSelect.Option>));
  return (<HebSelect onChange={setCurrentValue}
                     arrow={false}
                     type="primary"
                     value={currentValue}
                     dir="rtl"
                     style={{width: "100%"}}>{categoryOptions}</HebSelect>)
}