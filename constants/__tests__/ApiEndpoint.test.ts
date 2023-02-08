import { ApiEndpoint } from "../ApiEndpoint";
import { UserRole } from "../UserRole";

describe(ApiEndpoint.name, () => {
  it(ApiEndpoint.STUDENT_TASKS_ANSWERS_TEACHER_ID_LESSON_ID_URL.name, () => {
    const actual: string = ApiEndpoint.STUDENT_TASKS_ANSWERS_TEACHER_ID_LESSON_ID_URL("userTestId", "lessonTestId")
    const expected: string = `${ApiEndpoint.STUDENT_TASKS_ANSWERS_URL}/${UserRole.TEACHER}/${ApiEndpoint.LESSONS}/lessonTestId`
    expect(actual).toEqual(expected);
  })
  
  it(ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_START_URL.name, () => {
    const actual: string = ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_START_URL ("studentTaskAnswerId")
    const expected: string = `${ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_URL("studentTaskAnswerId")}/${ApiEndpoint.START}`
    expect(actual).toEqual(expected);
  })
  
  it(ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_FINISH_URL.name, () => {
    const actual: string = ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_FINISH_URL("studentTaskAnswerId")
    const expected: string = `${ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_URL("studentTaskAnswerId")}/${ApiEndpoint.FINISH}`
    expect(actual).toEqual(expected);
  })
  
  it(ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_RESTART_URL.name, () => {
    const actual: string = ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_RESTART_URL("studentTaskAnswerId")
    const expected: string = `${ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_URL("studentTaskAnswerId")}/${ApiEndpoint.RESTART}`
    expect(actual).toEqual(expected);
  })
  
  it(ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_EMAIL_URL.name, () => {
    const actual: string = ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_EMAIL_URL("studentTaskAnswerId")
    const expected: string = `${ApiEndpoint.STUDENT_TASKS_ANSWERS_ID_URL("studentTaskAnswerId")}/${ApiEndpoint.EMAIL}`;
    expect(actual).toEqual(expected);
  })
});