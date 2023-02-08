import { ApiEndpoint, CacheMode, HttpContentType, HttpMethod } from "../constants";
import { createUseHttpService, HttpService } from "./HttpService";

export class FileService extends HttpService {
  public async downloadFile(id): Promise<Blob> {
    return this._sendRequest({
                               uri: `${ApiEndpoint.FILE_DOWNLOAD}/${id}`,
                               method: HttpMethod.GET,
                               isAuthorized: true,
                               cacheMode: CacheMode.FORCE_CACHE,
                               responseType: HttpContentType.BLOB
                             });
  }

  public async createFile(body) {
    return this._sendRequest({
                               method: HttpMethod.POST,
                               uri: ApiEndpoint.FILE,
                               requestType: HttpContentType.MULTIPART,
                               responseType: HttpContentType.JSON,
                               body,
                               isAuthorized: true
                             });
  }

  public async deleteFileById(id) {
    return this._sendRequest({
                               uri: `${ApiEndpoint.FILE}/${id}`,
                               method: HttpMethod.DELETE,
                               isAuthorized: true
                             });
  }
}

export const useFileService = createUseHttpService(FileService);