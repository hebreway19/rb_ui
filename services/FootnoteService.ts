import { Footnote, Page } from "../types";
import { ApiEndpoint, CacheMode, DeleteTypes, HttpMethod } from "../constants";
import { createUseHttpService, HttpService } from "./HttpService";

export class FootnoteService extends HttpService {
  public async getFootnoteList(query = {}, pagination = {}): Promise<Page<Footnote>> {
    return this._sendRequest({
                                     method: HttpMethod.GET,
                                     uri: ApiEndpoint.FOOTNOTES,
                                     queryParams: {...query, pagination},
                                     isAuthorized: true
                                   });
  }

  public async getFootnoteListFromRecycleBin(pagination = {}): Promise<Page<Footnote>> {
    return this._sendRequest({
                                     method: HttpMethod.GET,
                                     uri: `${ApiEndpoint.FOOTNOTES}/recycle-bin`,
                                     queryParams: {pagination},
                                     isAuthorized: true
                                   });
  }

  public async getFootnoteById(id): Promise<Footnote> {
    return this._sendRequest({
                                     method: HttpMethod.GET,
                                     cacheMode: CacheMode.FORCE_CACHE,
                                     uri: `${ApiEndpoint.FOOTNOTES}/${id}`,
                                     isAuthorized: true
                                   });
  }

  public async updateFootnote(footnoteId: string, body: Footnote): Promise<Footnote> {
    return this._sendRequest({
                                     method: HttpMethod.PUT,
                                     uri: `${ApiEndpoint.FOOTNOTES}/${footnoteId}`,
                                     isAuthorized: true,
                                     body: body
                                   });
  }

  public async findFootnoteListByWord(word): Promise<Page<Footnote>> {
    return this._sendRequest({
                                     method: HttpMethod.GET,
                                     uri: `${ApiEndpoint.FOOTNOTES}/word/${word}`,
                                     isAuthorized: true
                                   });
  }

  public async createFootnote(body): Promise<Footnote> {
    return this._sendRequest({
                                     method: HttpMethod.POST,
                                     uri: ApiEndpoint.FOOTNOTES,
                                     isAuthorized: true,
                                     body: body
                                   });
  }

  public async addToRecycleBin(id) {
    return this._sendRequest({
                                     method: HttpMethod.DELETE,
                                     uri: `${ApiEndpoint.FOOTNOTES}/${DeleteTypes.ADD}/${id}`,
                                     isAuthorized: true
                                   });
  }

  public async removeFromRecycleBin(id) {
    return this._sendRequest({
                                     method: HttpMethod.DELETE,
                                     uri: `${ApiEndpoint.FOOTNOTES}/${DeleteTypes.RESTORE}/${id}`,
                                     isAuthorized: true
                                   });
  }

  public async deleteById(id) {
    return this._sendRequest({
                                     method: HttpMethod.DELETE,
                                     uri: `${ApiEndpoint.FOOTNOTES}/${DeleteTypes.REMOVE}/${id}`,
                                     isAuthorized: true
                                   });
  }
}

export const useFootnoteService = createUseHttpService(FootnoteService)