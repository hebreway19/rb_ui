import { RoutePath } from "../constants";
import { RouteUrl } from "../types";

const {
  TEACHER,
  STUDENT,
  LESSONS_PATH,
  ID,
  TYPE_PATH,
  SOURCE_ID_PATH,
  STUDENT_TASK_ANSWERS_ID_PATH,
  STUDENT_TASKS_ANSWERS_PATH,
  USER_ROLE
} = RoutePath;

export class RouteUtil {

  private static readonly StudentLessonFormRouteByIdAndType: string = ID(TYPE_PATH(STUDENT()));
  private static readonly StudentLessonFormRouteById: string = ID(LESSONS_PATH(STUDENT()));
  private static readonly StudentTasksAnswersByIdAndRole: string = STUDENT_TASK_ANSWERS_ID_PATH(ID(STUDENT_TASKS_ANSWERS_PATH(USER_ROLE())));

  static getTeacherLessonFormPathByIdAndType({id, type, sourceId = ""}): RouteUrl {
    let pathname = ID(TYPE_PATH(LESSONS_PATH(TEACHER())));
    const query = {
      id,
      type,
      sourceId
    };
    if (sourceId) {
      pathname = SOURCE_ID_PATH(pathname);
    } else {
      delete query.sourceId;
    }
    return {pathname, query};
  }

  static getStudentLessonFormPathByIdAndType({id, type}): RouteUrl {
    return {
      pathname: this.StudentLessonFormRouteByIdAndType,
      query: {
        id,
        type
      }
    };
  }

  static getStudentLessonFormRouteById({id}): RouteUrl {
    return {
      pathname: this.StudentLessonFormRouteById,
      query: {
        id
      }
    };
  }

  static getLessonFormRouteByLessonIdAndTaskAnswerIdAndUserRole({studentTasksAnswersId, userRole}): RouteUrl {
    const path: string = this.StudentTasksAnswersByIdAndRole;
    return {
      pathname: path,
      query: {
        userRole,
        studentTasksAnswersId
      }
    };
  }

  public static getStudentTasksAnswersForStudentByIdRoute({studentTasksAnswersId}): RouteUrl {
    const pathname = RoutePath.STUDENT_TASK_ANSWERS_ID_PATH(RoutePath.STUDENT_TASKS_ANSWERS_PATH(RoutePath.STUDENT()));
    return {
      pathname,
      query: {
        studentTasksAnswersId
      }
    };
  }
}