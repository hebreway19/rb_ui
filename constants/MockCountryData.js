export class MockCountryData {
  static IL = {
    letterCode: "IL",
    name: {
      en: "State of Israel",
      ru: "Государство Израиль",
      fr: "State of Israel"
    }
  };
  static RU = {
    letterCode: "RU",
    name: {
      en: "Russian Federation",
      ru: "Российская Федерация",
      fr: "Russian Federation"
    }
  };
  static GB 	= {
    letterCode: "GB",
    name: {
      en: "United Kingdom of Great Britain and Northern Ireland",
      ru: "Соединенное Королевство Великобритании и Северной Ирландии",
      fr: "United Kingdom of Great Britain and Northern Ireland"
    }
  };
  static USA 	= {
    letterCode: "USA",
    name: {
      en: "United States of America",
      ru: "Соединенные Штаты Америки",
      fr: "United States of America"
    }
  };
  static FR   = {
    letterCode: "FR",
    name: {
      en: "French Republic",
      ru: "Французская Республика",
      fr: "French Republic"
    }
  };

  static buildData(countryLetterCode = "USA") {
    let result = {};
    try {
      result = MockCountryData[countryLetterCode];
    } catch (error) {
      console.error(error);
      result = MockCountryData.USA;
    }
    return result;
  }
}

 MockCountryData;