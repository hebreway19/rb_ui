import { MetadataService } from "..";
import { ApiEndpoint, HttpMethod } from "../../constants";
import { SendRequest } from "../../types";


describe(MetadataService.name, () => {
  let mockSendRequest: SendRequest;
  let service: MetadataService;
  
  beforeEach(() => {
    mockSendRequest = jest.fn()
    service = new MetadataService(mockSendRequest);
  });
  
  describe("getBackendServerVersion()", () => {
    it(`sends ${HttpMethod.GET} request to ${ApiEndpoint.METADATA_VERSION}`, () => {
      const expectedParams = {method: HttpMethod.GET, uri: ApiEndpoint.METADATA_VERSION};
      service.getBackendServerVersion();
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
});