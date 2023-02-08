import { ApiEndpoint, CacheMode, HttpContentType, HttpMethod } from "../constants";
import { PaginateOptions } from "../types/MongoosePagination";
import { createUseHttpService, HttpService } from "./HttpService";

export class LessonsService extends HttpService {
  public async loadAllLessons(query = {}, pagination: PaginateOptions = {}) {
    return this._sendRequest({
                               method: HttpMethod.GET,
                               uri: ApiEndpoint.LESSONS_URL,
                               queryParams: {...query, pagination},
                               isAuthorized: true
                             });
  }

  public async deleteLessonById(lessonId) {
    return this._sendRequest({
                               method: HttpMethod.DELETE,
                               uri: `${ApiEndpoint.LESSONS_URL}/${lessonId}`,
                               isAuthorized: true
                             });
  }

  public async loadLessonById(lessonId) {
    return this._sendRequest({
                               method: HttpMethod.GET,
                               uri: `${ApiEndpoint.LESSONS_URL}/${lessonId}`,
                               isAuthorized: true
                             });
  }

  public async createLesson(lessonBody) {
    return this._sendRequest({
                               method: HttpMethod.POST,
                               uri: ApiEndpoint.LESSONS_URL,
                               body: lessonBody,
                               isAuthorized: true
                             });
  }

  public async updateLesson(lessonBody) {
    return this._sendRequest({
                               method: HttpMethod.PUT,
                               uri: `${ApiEndpoint.LESSONS_URL}/${lessonBody._id}`,
                               isAuthorized: true,
                               body: lessonBody
                             });
  }

  public async downloadPdf(lessonId) {
    return this._sendRequest({
                               cacheMode: CacheMode.NO_CACHE,
                               method: HttpMethod.GET,
                               uri: `${ApiEndpoint.LESSONS_DOWNLOAD_PDF}/${lessonId}`,
                               isAuthorized: true,
                               responseType: HttpContentType.BLOB
                             });
  }
}

export const useLessonsService = createUseHttpService(LessonsService);