import { StudentTasksAnswersService } from "..";
import { ApiEndpoint, CacheMode, HttpMethod, HttpContentType, UserRole } from "../../constants";
import { RequestParams, SendRequest } from "../../types";

describe(StudentTasksAnswersService.name, () => {
  let mockSendRequest: SendRequest;
  let service: StudentTasksAnswersService;
  
  beforeEach(() => {
    mockSendRequest = jest.fn()
    service = new StudentTasksAnswersService(mockSendRequest);
  });
  
  describe("getStudentTasksAnswersByQueryAndPage()", () => {
    it(`sends ${HttpMethod.GET} request to ${ApiEndpoint.STUDENT_TASKS_ANSWERS_URL}`, () => {
      const expectedParams: RequestParams = {
        method: HttpMethod.GET,
        uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_URL,
        isAuthorized: true,
        queryParams: {
          pagination: {}
        }
      }
      service.getStudentTasksAnswersByQueryAndPage();
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
  
  describe("getStudentTasksAnswersById()", () => {
    it(`sends ${HttpMethod.GET} request to ${ApiEndpoint.STUDENT_TASKS_ANSWERS_URL}/:id`, () => {
      const mockId: string = "mock_id";
      const expectedParams: RequestParams = {
        method: HttpMethod.GET,
        uri: `${ApiEndpoint.STUDENT_TASKS_ANSWERS_URL}/${mockId}`,
        isAuthorized: true
      }
      service.getStudentTasksAnswersById(mockId);
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
  
  describe("getStudentTasksAnswersById()", () => {
    it(`sends ${HttpMethod.GET} request to ${ApiEndpoint.STUDENT_TASKS_ANSWERS_URL}/${UserRole.STUDENT}/:studentId/${ApiEndpoint.LESSONS}/:lessonId`, () => {
      const mockStudentId: string = "mock_student_id";
      const mockLessonId: string = "mock_lesson_id";
      const expectedParams: RequestParams = {
        method: HttpMethod.GET,
        uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_STUDENT_ID_LESSON_ID_URL(mockStudentId, mockLessonId),
        isAuthorized: true
      }
      service.getStudentTasksAnswersByStudentAndLesson(mockStudentId, mockLessonId);
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
  
  describe("downloadPdf()", () => {
    it(`sends ${HttpMethod.GET} request to ${ApiEndpoint.STUDENT_TASKS_ANSWERS_URL}/:id/${ApiEndpoint.DOWNLOAD}`, () => {
      const mockId: string = "mock_id";
      const expectedParams: RequestParams = {
        cacheMode: CacheMode.NO_CACHE,
        method: HttpMethod.GET,
        uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_DOWNLOAD_URL(mockId),
        isAuthorized: true,
        responseType: HttpContentType.BLOB
      }
      service.downloadPdf(mockId);
      expect(mockSendRequest).toHaveBeenCalled();
      expect(mockSendRequest).toHaveBeenCalledWith(expectedParams);
    });
  });
});