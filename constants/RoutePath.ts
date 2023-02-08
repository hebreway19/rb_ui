/**
 * A class that stores paths for routing.
 */
import { LessonType } from "./LessonType";
import { UserRole } from "./UserRole";

export class RoutePath {

    // Root path
    public static readonly ROOT: string = "/";
    public static readonly NOT_FOUND: string = "/404"

    public static ID = (path = ""): string => `${path}/[id]`;

    public static OPTIONAL_PARAM = (param = ""): string => `${param}?`;

    public static APP_PRIVACY_STATEMENT = (path: string = ""): string => `${path}/privacy-statement`

    public static USER_ROLE = (path: string = ""): string => `${path}/[userRole]`;

    // Review application to ulpan
    public static APPLICATION_REVIEW = (path = ""): string => `${path}/admin/application-review`;

    public static OVERVIEW = (path = ""): string => `${path}/overview`;

    // UI
    public static UI_ELEMENTS = (path = ""): string => `${path}/ui-elements`;

    // EMAIL_IS_ACTIVATED
    public static EMAIL_IS_ACTIVATED = (path = ""): string => `${path}/active-email`;

    // Super admin
    public static USER_LIST = (path = ""): string => `${path}/admin/users`;
    public static readonly ULPAN_LIST: string = `/admin/ulpans`;

    public static readonly ID_FOOTNOTE = (path = ""): string => `${path}/:footnoteId`;

    // Ulpan admin
    public static readonly ULPAN_ADMIN: string = `${RoutePath.ROOT}ulpan-admin`;
    public static readonly ULPAN_ADMIN_USERS: string = `${RoutePath.ULPAN_ADMIN}/users`;

    // Agreement
    public static AGREEMENT = (path = ""): string => `${path}/agreement`;
    public static USER_AGREEMENT = (path = ""): string => `${path}${RoutePath.PROFILE()}/user-agreement`;
    // Log in page
    public static LOGIN = (path = ""): string => `${path}/login`;

    // Recovery password page
    public static FORGOT_PASSWORD = (path = ""): string => `${path}/forgot-password`;
    public static RECOVERY_PASSWORD = (path = ""): string => `${path}/reset-password`;

    // Registration pages
    public static REGISTRATION = (path = ""): string => `${path}/register`;
    public static REGISTRATION_CHECK_MAIL = (path = ""): string => `${path}/check-your-mail`;

    // User pages
    public static USER = (path = ""): string => `${path}/user`;
    public static PROFILE = (path = ""): string => `${path}/profile`;
    public static PROFILE_OTHER = (path = ""): string => `${path}${this.PROFILE()}/other`;
    public static PROFILE_ULPAN = (path = ""): string => `${path}${this.PROFILE()}/choose-ulpan`;
    public static PROFILE_OPTIONS = (path = ""): string => `${path}/settings`;
    public static USER_RECOVERY = `${this.PROFILE()}/account-recovery`;

    // Registration as ulpan
    public static readonly REGISTRATION_AS_ULPAN: string = `${RoutePath.REGISTRATION()}/ulpan`;

    // Ulpan admin
    public static readonly ULPAN_ADMIN__LIST_OF_REVIEW: string = `${RoutePath.ULPAN_ADMIN}/review`;

    //Lessons
    public static readonly LESSON_ID: string = "lessonId";
    public static readonly SOURCE_ID: string = "sourceId";
    public static readonly TYPE: string = "type";
    public static readonly LESSON_ID_PATH = (path = ""): string => `${path}/[${RoutePath.LESSON_ID}]`;
    public static readonly LESSONS_PATH = (path = ""): string => `${path}/lessons`;
    public static readonly TYPE_PATH = (path = ""): string => `${path}/[${RoutePath.TYPE}]`;
    public static readonly LESSON_PATH = (path = ""): string => `${path}/${LessonType.LESSON}`;
    public static readonly SOURCE_ID_PATH = (path = ""): string => `${path}/[${RoutePath.SOURCE_ID}]`;
    public static readonly TEMPLATE_PATH = (path = ""): string => `${path}/${LessonType.TEMPLATE}`;
    public static readonly EXAM_PATH = (path = ""): string => `${path}/${LessonType.EXAM}`;

    public static TEACHER = (path = ""): string => `${path}/${UserRole.TEACHER}`;
    public static STUDENT = (path = ""): string => `${path}/${UserRole.STUDENT}`;

    //Footnotes
    public static FOOTNOTES = (path = ""): string => `${path}/footnotes`;
    public static FOOTNOTE: string = "footnote";

    //List
    public static LIST = (path = ""): string => `${path}/list`;

    public static TIME_TABLE = (path = ""): string => `${path}/timetable`;

    // Student tasks answers
    public static STUDENT_TASKS_ANSWERS_ID = "studentTasksAnswersId";
    public static STUDENT_TASKS_ANSWERS_PATH = (path = ""): string => `${path}/answers`;
    public static STUDENT_TASK_ANSWERS_ID_PATH = (path: string = ""): string => `${path}/[${RoutePath.STUDENT_TASKS_ANSWERS_ID}]`;

}