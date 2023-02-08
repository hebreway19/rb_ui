import React, { useCallback } from "react";
import { HebRadio } from "../../../components/HebElements";
import { useLanguage } from "../../../providers";

type ChangeLanguageComponentProps = {
	marginRight?: number;
};

export const ChangeLanguageComponent = ({marginRight}: ChangeLanguageComponentProps) => {
	const {language, updateLanguage} = useLanguage();
	const changeLanguage = useCallback((lng) => () => updateLanguage(lng), [updateLanguage]);

	let styles = {};
	if (marginRight) {
		styles = {marginRight: marginRight};
	}

	return (
		<>
			<HebRadio.Group value={language} dir="ltr">
				<HebRadio.Button value="en" onClick={changeLanguage("en")} style={styles}>
					En
				</HebRadio.Button>
				<HebRadio.Button value="fr" onClick={changeLanguage("fr")} style={styles}>
					Fr
				</HebRadio.Button>
				<HebRadio.Button value="ru" onClick={changeLanguage("ru")}>
					Ru
				</HebRadio.Button>
			</HebRadio.Group>
		</>
	);
};
