import { ApiEndpoint, HttpMethod } from "../constants";
import { RequestUtil } from "../util";

export class ExerciseService {
  static async setExerciseAnswer(id, answerBody) {
    return RequestUtil.sendRequest({
                                     method: HttpMethod.PUT,
                                     uri: `${ApiEndpoint.EXERCISES}/${id}/answers`,
                                     isAuthorized: true,
                                     body: answerBody
                                   });
  }
  
  static async finish(id) {
    return RequestUtil.sendRequest({
                                     method: HttpMethod.PUT,
                                     uri: `${ApiEndpoint.EXERCISES}/${id}/answers/finish`,
                                     isAuthorized: true
                                   });
  }
}