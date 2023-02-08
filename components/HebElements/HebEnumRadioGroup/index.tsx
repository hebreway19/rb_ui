import { useTranslation } from "next-i18next";
import { HebForm, HebRadio, HebTooltip } from "../index";
import React from "react";
import nl2br from "react-nl2br";

type HebEnumRadioGroupType = {
  enumType: any;
  enumTypeName: string;
  isTooltipVisible?: boolean;
  contentDirection?: "ltr" | "rtl";
  formItemProps: any;
};

export const HebEnumRadioGroup = ({enumType, enumTypeName, isTooltipVisible = true, contentDirection = "ltr", formItemProps = {}, ...props}: HebEnumRadioGroupType) => {
  const {t} = useTranslation();
  const enumLabel = t(`enums.${enumTypeName}.label`);
  const enumTooltip = t(`enums.${enumTypeName}.tooltip`);
  const options = Object.keys(enumType)
                        .map(enumKey => (
                          <HebRadio.Button key={enumKey} value={enumType[enumKey]}>
                            {t(`enums.${enumTypeName}.${enumKey}.title`)}
                          </HebRadio.Button>));
  return (
    <HebForm.Item label={enumLabel}
                  tooltip={<HebTooltip>{nl2br(enumTooltip)}</HebTooltip>} {...formItemProps}>
      <HebRadio.Group disabled={formItemProps.disabled}>
        {contentDirection === "rtl" && options.slice().reverse()}
        {contentDirection === "ltr" && options}
      </HebRadio.Group>
    </HebForm.Item>
  );
}