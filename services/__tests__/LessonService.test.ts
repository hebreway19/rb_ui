import { LessonsService } from "..";
import { ApiEndpoint, CacheMode, HttpContentType, HttpMethod } from "../../constants";
import { Lesson, LocalizedContent, RequestParams, SendRequest, Task } from "../../types";

describe(LessonsService.name, () => {
  let mockSendRequest: SendRequest;
  let service: LessonsService;
  
  beforeEach(() => {
    mockSendRequest = jest.fn();
    service = new LessonsService(mockSendRequest);
  });
  
  describe("loadAllLessons()", () => {
    it(`sends ${HttpMethod.GET} request to ${ApiEndpoint.LESSONS_URL}`, () => {
      const expectedParams: RequestParams = { method: HttpMethod.GET,
                                              uri: ApiEndpoint.LESSONS_URL,
                                              isAuthorized: true,
                                              queryParams: {
                                                pagination: {}
                                              }};
      service.loadAllLessons();
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
  
  describe("loadAllLessons()", () => {
    it(`sends ${HttpMethod.GET} request to ${ApiEndpoint.LESSONS_URL}`, () => {
      const lessonId: string = "test_lesson_id";
      const expectedParams: RequestParams = { method: HttpMethod.GET,
                                              uri: `${ApiEndpoint.LESSONS_URL}/${lessonId}`,
                                              isAuthorized: true };
      service.loadLessonById(lessonId);
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
  
  describe("createLesson()", () => {
    it(`sends ${HttpMethod.POST} request to ${ApiEndpoint.LESSONS_URL}`, () => {
      const requestBody: Partial<Lesson> = {
        title: { he: "test", he_nikkudot: "test!" },
        tasks: [{
          content: [{ he: "test text", he_nikkudot: "test text!" }] as LocalizedContent[]
        }] as Task[]
      }
      const expectedParams: RequestParams = { method: HttpMethod.POST,
                                              uri: ApiEndpoint.LESSONS_URL,
                                              body: requestBody,
                                              isAuthorized: true };
      service.createLesson(requestBody);
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    })
  });
  
  describe("deleteLessonById()", () => {
    it(`sends ${HttpMethod.DELETE} request to ${ApiEndpoint.LESSONS_URL}`, () => {
      const lessonId: string = "test_lesson_id";
      const expectedParams: RequestParams = { method: HttpMethod.DELETE,
        uri: `${ApiEndpoint.LESSONS_URL}/${lessonId}`,
        isAuthorized: true };
      service.deleteLessonById(lessonId);
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
  
  describe("downloadPdf()", () => {
    it(`sends ${HttpMethod.GET} request to ${ApiEndpoint.LESSONS_DOWNLOAD_PDF}`, () => {
      const lessonId: string = "test_lesson_id";
      const expectedParams: RequestParams = { method: HttpMethod.GET,
        cacheMode: CacheMode.NO_CACHE,
        responseType: HttpContentType.BLOB,
        uri: `${ApiEndpoint.LESSONS_DOWNLOAD_PDF}/${lessonId}`,
        isAuthorized: true };
      service.downloadPdf(lessonId);
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
  
  describe("updateLesson()", () => {
    it(`sends ${HttpMethod.PUT} request to ${ApiEndpoint.LESSONS_DOWNLOAD_PDF}`, () => {
      const lessonId: string = "test_lesson_id";
      const requestBody: Partial<Lesson> = {
        _id: lessonId,
        title: { he: "test", he_nikkudot: "test!" },
        tasks: [{
          content: [{ he: "test text", he_nikkudot: "test text!" }] as LocalizedContent[]
        }] as Task[]
      }
      const expectedParams: RequestParams = { method: HttpMethod.PUT,
                                              uri: `${ApiEndpoint.LESSONS_URL}/${requestBody._id}`,
                                              body: requestBody,
                                              isAuthorized: true };
      service.updateLesson(requestBody);
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
});