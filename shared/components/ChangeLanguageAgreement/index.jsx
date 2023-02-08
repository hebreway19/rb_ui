import React, { useCallback } from "react";
import { LanguageCode } from "../../../constants";
import { HebRadio } from "../../../components/HebElements";

export const ChangeLanguageAgreement = ({placement = "top", changeLanguage, language}) => {

  const handleLanguageClick = useCallback((event) => changeLanguage(event.target.value), [changeLanguage]);
  return <>
    <HebRadio.Group value={language}>
      <HebRadio.Button value={LanguageCode.EN} onClick={handleLanguageClick}>
        En
      </HebRadio.Button>
      <HebRadio.Button value={LanguageCode.FR} onClick={handleLanguageClick}>
        Fr
      </HebRadio.Button>
      <HebRadio.Button value={LanguageCode.RU} onClick={handleLanguageClick}>
        Ru
      </HebRadio.Button>
      <HebRadio.Button value={LanguageCode.HE} onClick={handleLanguageClick}>
        He
      </HebRadio.Button>
    </HebRadio.Group>
  </>

}