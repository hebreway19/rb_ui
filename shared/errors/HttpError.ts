import { ExtendableError } from "./index";

type HttpErrorBody = {
  payload?: object | string;
  path?: string;
  originalUrl?: string,
  statusCode?: number,
  message?: string,
  errorType?: string,
};

export class HttpError extends ExtendableError {
  constructor({httpCode, text, body}: { httpCode: number, text: string, body?: HttpErrorBody | string }) {
    let formattedMessage = `${httpCode}: ${text}`;
    if (body) {
      if (body instanceof String) {
        formattedMessage += `\n${body}`;
      } else {
        formattedMessage += `\n${(body as HttpErrorBody).message}`;
      }
    }
    super(formattedMessage);
    this._body = body;
  }

  private _body: HttpErrorBody | string;

  public get body(): HttpErrorBody | string {
    return this._body;
  }

  public static async fromResponse(response: Response) {
    const httpCode = response.status;
    const text = response.statusText;
    let body: HttpErrorBody | string  = await response.text();
    try {
      body = JSON.parse(body);
    }
    catch (error) {
      console.error(error);
    }
    return new HttpError({httpCode, text, body});
  }

}