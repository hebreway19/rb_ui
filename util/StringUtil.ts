export class StringUtil {
  public static removeNikkudots(sourceString?: string): string {
    return sourceString?.replace(/[\u0591-\u05C7]/g, "") || "";
  }

  public static removeSpecialCharacters(source: string, substitute?: string): string {
    return source.replace(/[ .,\/#!$?%\^&\*;:{}=\-_`~()]/g, substitute);
  }

  public static convertHtmlStringToStringArrayWithOutHtml(sourceString): string[] {
    let resultArray = sourceString.replace(/&nbsp;/g, " ")
                                  .replace(/<\/?[^>]+(>|$)/g, " ")
                                  .replace(/&\/?[^;]+(;|$)/g, " ")
                                  .split(" ")
                                  .map(word => word.trim())
                                  .filter(word => word.length);
    resultArray[0] === "" && resultArray.splice(0, 1);
    return resultArray
  }

  public static convertSentenceToWordArray(sourceString): string[] {
    return sourceString.split(" ");
  }

  public static splitByWords(source): string {
    return source.split(/\s+/g)
                 .filter(String);
  }
  
  public static getUnicodeSymbolByHexadecimal(hexadecimal: string) {
    return String.fromCharCode(parseInt(hexadecimal, 16));
  }
}