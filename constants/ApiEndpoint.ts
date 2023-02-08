import { UserRole } from "./UserRole";
import {ThirdPartyAuthorizationService} from "./ThirdPartyAuthorizationService";

export class ApiEndpoint {

    // HOST:PORT
    public static API_HOST: string = process.env.NEXT_PUBLIC_API_ENDPOINT ?? "http://localhost:5000";

    // AUTH PATH TO SERVER
    public static LOGIN: string = `${this.API_HOST}/login`;

    public static AUTH_LOCAL: string = `${this.API_HOST}/auth`;

    public static ME: string = `${this.AUTH_LOCAL}/me`;
    public static REFRESH_TOKEN: string = `${this.AUTH_LOCAL}/refresh-token`;
    public static RESEND_CONFIRMATION_LINK: string = `${this.AUTH_LOCAL}/resend-confirmation-link`;

    public static AUTH_LOCAL_LOGIN: string = `${this.AUTH_LOCAL}/login`;
    public static AUTH_LOCAL_REGISTER: string = `${this.AUTH_LOCAL}/register`;
    public static AUTH_WITH_GOOGLE: string = `${this.AUTH_LOCAL}/google`;
    public static AUTH_WITH_VKONTAKTE: string = `${this.AUTH_LOCAL}/vkontakte`;
    public static AUTH_WITH_FACEBOOK: string = `${this.AUTH_LOCAL}/facebook`;
    public static AUTH_WITH_APPLE_CALLBACK: string = `${this.AUTH_LOCAL}/icloud/callback`;
    public static FORGOT_PASSWORD: string = `${this.AUTH_LOCAL}/forgot-password`;
    public static UPDATE_PASSWORD: string = `${this.AUTH_LOCAL}/update-password`;

    // REGISTER PATH TO SERVER
    
    // METADATA PATH
    public static METADATA: string = `${this.API_HOST}/metadata`;
    public static METADATA_VERSION: string = `${this.METADATA}/version`

    // SESSION PATH
    public static SESSION: string = `${this.API_HOST}/session`;

    // USERS
    public static USERS: string = `${this.API_HOST}/users`;
    public static USER_PASSWORD: string = `${this.USERS}/password`;
    public static USER_STATE: string = `${this.USERS}/state`;
    public static USER_REMOVE: string = `${this.USERS}/remove`;
    public static USER_SOCIAL = (userSocial: ThirdPartyAuthorizationService) => `${this.USERS}/${userSocial}`;

    // ULPAN
    public static ULPANS: string = `${this.API_HOST}/ulpans`

    // FILE
    public static FILE: string = `${this.API_HOST}/files`;
    public static FILE_DOWNLOAD: string = `${this.FILE}/download`;

    //Lessons
    public static LESSONS: string = "lessons";
    public static DOWNLOAD: string = "download";
    public static LESSONS_URL: string = `${this.API_HOST}/${this.LESSONS}`;
    public static LESSONS_DOWNLOAD_PDF: string = `${this.LESSONS_URL}/${this.DOWNLOAD}`;

    //Agreement
    public static AGREEMENT: string = `${this.API_HOST}/useragreement`;

    //Footnote
    public static FOOTNOTES: string = `${this.API_HOST}/footnotes`;

    //Exercise
    public static EXERCISES: string = `${this.API_HOST}/exercises`;

    //TaskAnswer
    public static TASK_ANSWERS: string = `${this.API_HOST}/task_answers`

    //Answer
    public static ANSWERS: string = `${this.API_HOST}/answers`

    //StudentTasksAnswers
    public static START: string = "start";
    public static FINISH: string = "finish";
    public static RESTART: string = "restart";
    public static EMAIL: string = "email";
    public static readonly STUDENT_TASKS_ANSWERS: string = "student-tasks-answers";
    public static readonly STUDENT_TASKS_ANSWERS_URL: string = `${this.API_HOST}/${this.STUDENT_TASKS_ANSWERS}`;
    public static readonly STUDENT_TASKS_ANSWERS_STUDENT_ID_LESSON_ID_URL = (studentId, lessonId) => `${this.STUDENT_TASKS_ANSWERS_URL}/${UserRole.STUDENT}/${studentId}/${this.LESSONS}/${lessonId}`;
    public static readonly STUDENT_TASKS_ANSWERS_TEACHER_ID_LESSON_ID_URL = (teacherId, lessonId) => `${this.STUDENT_TASKS_ANSWERS_URL}/${UserRole.TEACHER}/${this.LESSONS}/${lessonId}`;
    public static readonly STUDENT_TASKS_ANSWERS_ID_URL = (studentTasksAnswersId) => `${this.STUDENT_TASKS_ANSWERS_URL}/${studentTasksAnswersId}`;
    public static readonly STUDENT_TASKS_ANSWERS_ID_START_URL = (studentTasksAnswersId) => `${this.STUDENT_TASKS_ANSWERS_ID_URL(studentTasksAnswersId)}/${this.START}`;
    public static readonly STUDENT_TASKS_ANSWERS_ID_FINISH_URL = (studentTasksAnswersId) => `${this.STUDENT_TASKS_ANSWERS_ID_URL(studentTasksAnswersId)}/${this.FINISH}`;
    public static readonly STUDENT_TASKS_ANSWERS_ID_RESTART_URL = (studentTasksAnswersId) => `${this.STUDENT_TASKS_ANSWERS_ID_URL(studentTasksAnswersId)}/${this.RESTART}`;
    public static readonly STUDENT_TASKS_ANSWERS_ID_DOWNLOAD_URL = (studentTasksAnswersId) => `${this.STUDENT_TASKS_ANSWERS_ID_URL(studentTasksAnswersId)}/${this.DOWNLOAD}`;
    public static readonly STUDENT_TASKS_ANSWERS_ID_EMAIL_URL = (studentTasksAnswersId) => `${this.STUDENT_TASKS_ANSWERS_ID_URL(studentTasksAnswersId)}/${this.EMAIL}`;
}