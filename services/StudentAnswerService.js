import { ApiEndpoint, HttpMethod } from "../constants";
import { RequestUtil } from "../util";

export class StudentAnswerService {
  static async getAnswerByExerciseId(id) {
    return RequestUtil.sendRequest({
                                     method: HttpMethod.GET,
                                     uri: `${ApiEndpoint.EXERCISES}/${id}/answers`,
                                     isAuthorized: true
                                   });
  }

  static async getAnswersByIds(answerIds) {
    const body = {answersIds: answerIds};
    return RequestUtil.sendRequest({
                                     method: HttpMethod.GET,
                                     uri: `${ApiEndpoint.API_HOST}/student-exercise-answer`,
                                     body: body,
                                     isAuthorized: true
                                   });
  }

  static async commitAnswerByTaskAnswerId(id, answer) {
    return RequestUtil.sendRequest({
                                     method: HttpMethod.PUT,
                                     uri: `${ApiEndpoint.EXERCISES}/answers/${id}`,
                                     body: answer,
                                     isAuthorized: true
                                   });
  }

  static async removeAnswerByTaskAnswerId(id, answer) {
    return RequestUtil.sendRequest({
                                     method: HttpMethod.DELETE,
                                     uri: `${ApiEndpoint.EXERCISES}/answers/${id}`,
                                     body: answer,
                                     isAuthorized: true
                                   });
  }

  static async commitAnswer(id, answer) {
    return RequestUtil.sendRequest({
                                     method: HttpMethod.PUT,
                                     uri: `${ApiEndpoint.EXERCISES}/${id}/answers`,
                                     body: answer,
                                     isAuthorized: true
                                   });
  }
}