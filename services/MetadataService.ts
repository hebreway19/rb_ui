import { ApiEndpoint, HttpMethod } from "../constants";
import { createUseHttpService, HttpService } from "./HttpService";

export class MetadataService extends HttpService {
  public async getBackendServerVersion() {
    return this._sendRequest({
                               method: HttpMethod.GET,
                               uri: ApiEndpoint.METADATA_VERSION
                             });
  }
}

export const useMetadataService = createUseHttpService(MetadataService);