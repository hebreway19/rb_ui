import { RoutePath, UserRole, UserState } from "../constants";
import { AuthUser } from "../types";

type AdditionalRequirement = (user?: AuthUser) => boolean;

export type RedirectRoutePath = {
  pathname: string;
  hasAnyRoles?: UserRole[];
  allowedState?: UserState[];
  additionalRequirements?: AdditionalRequirement[];
}

const hasNoUser = (user?: AuthUser) => !user;

// pathname examples: /profile or /teacher/lessons/[type]/[lessonId]
export const PagesRestrictions: RedirectRoutePath[] = [
  {
    pathname: RoutePath.PROFILE(),
    hasAnyRoles: [UserRole.ANY],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.PROFILE_OPTIONS(),
    hasAnyRoles: [UserRole.ANY],
    allowedState: [UserState.ANY]
  },
  {
    pathname: RoutePath.PROFILE_ULPAN(),
    hasAnyRoles: [UserRole.ANY],
    allowedState: [UserState.AWAIT_TO_CHOOSE_ULPAN]
  },
  {
    pathname: RoutePath.LESSONS_PATH(RoutePath.TIME_TABLE()),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.TEACHER],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.UI_ELEMENTS(),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.TEACHER],
    allowedState: [UserState.ACTIVE]
  },

  // Admin only
  {
    pathname: RoutePath.USER_AGREEMENT(),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.PROJECT_ADMIN],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.USER_LIST(),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.PROJECT_ADMIN],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.ULPAN_LIST,
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.PROJECT_ADMIN],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.ULPAN_ADMIN,
    hasAnyRoles: [UserRole.ULPAN_ADMIN],
    allowedState: [UserState.ACTIVE]
  },

  // Teacher only
  {
    pathname: RoutePath.STUDENT_TASKS_ANSWERS_PATH(RoutePath.STUDENT_TASKS_ANSWERS_PATH(RoutePath.TEACHER())),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.TEACHER],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.STUDENT_TASK_ANSWERS_ID_PATH(RoutePath.STUDENT_TASKS_ANSWERS_PATH(RoutePath.TEACHER())),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.TEACHER],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.LIST(RoutePath.FOOTNOTES(RoutePath.TEACHER())),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.TEACHER],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.TYPE_PATH(RoutePath.LESSONS_PATH(RoutePath.TEACHER())),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.TEACHER],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.LESSON_ID_PATH(RoutePath.TYPE_PATH(RoutePath.LESSONS_PATH(RoutePath.TEACHER()))),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.TEACHER],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.SOURCE_ID_PATH(RoutePath.LESSON_ID_PATH(RoutePath.TYPE_PATH(RoutePath.LESSONS_PATH(RoutePath.TEACHER())))),
    hasAnyRoles: [UserRole.ULPAN_ADMIN, UserRole.TEACHER],
    allowedState: [UserState.ACTIVE]
  },

  // Student only
  {
    pathname: RoutePath.STUDENT_TASKS_ANSWERS_PATH(RoutePath.STUDENT()),
    hasAnyRoles: [UserRole.STUDENT],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.STUDENT_TASK_ANSWERS_ID_PATH(RoutePath.STUDENT_TASKS_ANSWERS_PATH(RoutePath.STUDENT())),
    hasAnyRoles: [UserRole.STUDENT],
    allowedState: [UserState.ACTIVE]
  },
  {
    pathname: RoutePath.LESSON_ID_PATH(RoutePath.LESSONS_PATH(RoutePath.STUDENT())),
    hasAnyRoles: [UserRole.STUDENT],
    allowedState: [UserState.ACTIVE]
  },

  // Deleted only
  {
    pathname: RoutePath.USER_RECOVERY,
    hasAnyRoles: [UserRole.STUDENT, UserRole.TEACHER, UserRole.ENROLE, UserRole.PROJECT_ADMIN, UserRole.ULPAN_ADMIN],
    allowedState: [UserState.DELETED]
  }
];