import { Page, StudentTasksAnswers } from "../types";
import { ApiEndpoint, CacheMode, HttpContentType, HttpMethod } from "../constants";
import { HttpService, useHttpService } from "./HttpService";
import { Options } from "nodemailer/lib/mailer";

export class StudentTasksAnswersService extends HttpService {
  public async getStudentTasksAnswersByQueryAndPage(query = {}, pagination = {}): Promise<Page<StudentTasksAnswers>> {
    return this._sendRequest({
                               method: HttpMethod.GET,
                               uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_URL,
                               queryParams: {...query, pagination},
                               isAuthorized: true
                             });
  }

  public async getStudentTasksAnswersByStudentAndLesson(studentId: string, lessonId: string): Promise<StudentTasksAnswers> {
    return this._sendRequest({
                               uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_STUDENT_ID_LESSON_ID_URL(studentId, lessonId),
                               method: HttpMethod.GET,
                               isAuthorized: true
                             });
  }

  public async getStudentTasksAnswersById(studentTasksAnswersId: any): Promise<StudentTasksAnswers> {
    return this._sendRequest({
                               uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_URL(studentTasksAnswersId),
                               method: HttpMethod.GET,
                               isAuthorized: true
                             });
  }

  public async updateStudentTasksAnswers(studentTasksAnswersId: string, studentTasksAnswersUpdatePayload: StudentTasksAnswers): Promise<StudentTasksAnswers> {
    return this._sendRequest({
                               uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_URL(studentTasksAnswersId),
                               method: HttpMethod.PUT,
                               body: studentTasksAnswersUpdatePayload,
                               isAuthorized: true
                             });
  }

  public async startStudentTaskAnswer(studentTasksAnswersId: string): Promise<StudentTasksAnswers> {
    return this._sendRequest({
                               uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_START_URL(studentTasksAnswersId),
                               method: HttpMethod.POST,
                               isAuthorized: true
                             });
  }

  public async finishStudentTaskAnswer(studentTasksAnswersId: string): Promise<StudentTasksAnswers> {
    return this._sendRequest({
                               uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_FINISH_URL(studentTasksAnswersId),
                               method: HttpMethod.POST,
                               isAuthorized: true
                             });
  }

  public async restartStudentTaskAnswer(studentTasksAnswersId: string): Promise<StudentTasksAnswers> {
    return this._sendRequest({
      uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_RESTART_URL(studentTasksAnswersId),
      method: HttpMethod.POST,
      isAuthorized: true
    })
  }

  public async downloadPdf(studentTasksAnswersId: string) {
    return this._sendRequest({
                               cacheMode: CacheMode.NO_CACHE,
                               method: HttpMethod.GET,
                               uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_DOWNLOAD_URL(studentTasksAnswersId),
                               isAuthorized: true,
                               responseType: HttpContentType.BLOB
                             });
  }

  public async sendStudentTaskAnswerByEmail(studentTasksAnswersId: string, emailProps: Options) {
    return this._sendRequest({
                               uri: ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_EMAIL_URL(studentTasksAnswersId),
                               method: HttpMethod.POST,
                               body: emailProps,
                               isAuthorized: true
                             });
  }
}

export const useStudentTasksAnswersService = () => useHttpService(StudentTasksAnswersService);