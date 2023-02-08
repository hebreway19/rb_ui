import { FileService } from "../.";
import { ApiEndpoint, CacheMode, HttpContentType, HttpMethod } from "../../constants";
import { createMockFile } from "../../test-utils";
import { RequestParams, SendRequest } from "../../types";

describe(FileService.name, () => {
  let mockSendRequest: SendRequest;
  let service: FileService;
  
  beforeEach(() => {
    mockSendRequest = jest.fn();
    service = new FileService(mockSendRequest);
  });
  
  it("downloadFile", () => {
    const expectedParams: RequestParams = { method: HttpMethod.GET,
                                            uri:  `${ApiEndpoint.FILE_DOWNLOAD}/test`,
                                            isAuthorized: true,
                                            cacheMode: CacheMode.FORCE_CACHE,
                                            responseType: HttpContentType.BLOB
                                          };
    service.downloadFile("test");
    expect(mockSendRequest).toHaveBeenCalled();
    expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
  })
  it("createFile", () => {
    const requestBody = createMockFile("file.jpeg", 10, "image/jpeg")
    const expectedParams: RequestParams = { method: HttpMethod.POST,
                                            uri: ApiEndpoint.FILE,
                                            requestType: HttpContentType.MULTIPART,
                                            responseType: HttpContentType.JSON,
                                            body: requestBody,
                                            isAuthorized: true
                                          };
    service.createFile(requestBody);
    expect(mockSendRequest).toHaveBeenCalled();
    expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
  })
  it("deleteFileById", () => {
    const fileId: string = "test";
    const expectedParams: RequestParams = { method: HttpMethod.DELETE,
                                            uri: ApiEndpoint.FILE + "/" + fileId,
                                            isAuthorized: true,
                                          };
    service.deleteFileById(fileId);
    expect(mockSendRequest).toHaveBeenCalled();
    expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
  })
});