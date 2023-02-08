import React, { ReactElement } from "react";
import { LessonType, RoutePath, UserRole, UserState } from "../../../constants";
import { BookOutlined, CalendarOutlined, LockOutlined, OrderedListOutlined, SettingOutlined, SmileOutlined, SolutionOutlined, UserOutlined } from "@ant-design/icons";
import { AnswersIcon, Apps2LineIcon, ExamIcon, LessonIcon, TemplateIcon } from "../../icons";

const {
  PROFILE,
  PROFILE_ULPAN,
  USER_LIST,
  LESSONS_PATH,
  TEACHER,
  STUDENT,
  STUDENT_TASKS_ANSWERS_PATH,
  TIME_TABLE,
  TYPE_PATH,
  FOOTNOTES,
  LIST
} = RoutePath;

export type PageInfo = {
  key: string;
  states: UserState[];
  path?: any;
  icon: ReactElement;
  roles?: UserRole[];
}
export const pages: PageInfo[] = [
  {
    key: "account_info",
    states: [
      UserState.AWAIT_REVIEW_BY_ULPAN,
      UserState.ACTIVE,
      UserState.ON_VACATION,
      UserState.BANNED
    ],
    path: {pathname: PROFILE()},
    icon: (<UserOutlined/>),
    roles: [
      UserRole.PROJECT_ADMIN,
      UserRole.ULPAN_ADMIN,
      UserRole.STUDENT,
      UserRole.TEACHER
    ]
  },
  {
    key: "choose_ulpan",
    path: {pathname: PROFILE_ULPAN()},
    states: [UserState.AWAIT_TO_CHOOSE_ULPAN],
    icon: (<Apps2LineIcon/>),
    roles: [UserRole.ANY]
  },
  {
    key: "list_of_users",
    states: [
      UserState.ACTIVE,
      UserState.ON_VACATION
    ],
    icon: (<SmileOutlined/>),
    path: {pathname: USER_LIST()},
    roles: [
      UserRole.PROJECT_ADMIN,
      UserRole.ULPAN_ADMIN
    ]
  },
  {
    key: "list_of_ulpans",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<SolutionOutlined/>),
    path: {pathname: RoutePath.ULPAN_LIST},
    roles: [UserRole.PROJECT_ADMIN]
  },
  {
    key: "administrators_of_ulpans",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
    roles: [UserRole.PROJECT_ADMIN]
  },
  {
    key: "list_of_teacher",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
    roles: [UserRole.ULPAN_ADMIN]
  },
  {
    key: "list_of_groups",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
    roles: [UserRole.ULPAN_ADMIN]
  },
  {
    key: "list_of_students",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
    roles: [UserRole.ULPAN_ADMIN]
  },
  {
    key: "list_of_tasks",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
    roles: [UserRole.ULPAN_ADMIN]
  },
  {
    key: "list_of_exercises",
    states: [
      UserState.ACTIVE,
      UserState.ON_VACATION
    ],
    icon: (<LockOutlined/>),
    roles: [
      UserRole.ULPAN_ADMIN,
      UserRole.PROJECT_ADMIN
    ]
  },
  {
    key: "list_of_courses",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
    roles: [UserRole.TEACHER]
  },
  {
    key: "templates",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    path: {pathname: TYPE_PATH(LESSONS_PATH(TEACHER())), query: {type: LessonType.TEMPLATE}},
    icon: (<TemplateIcon/>),
    roles: [UserRole.TEACHER]
  },
  {
    key: "lessons",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    path: {pathname: TYPE_PATH(LESSONS_PATH(TEACHER())), query: {type: LessonType.LESSON}},
    icon: (<LessonIcon/>),
    roles: [UserRole.TEACHER]
  },
  {
    key: "exams",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    path: {pathname: TYPE_PATH(LESSONS_PATH(TEACHER())), query: {type: LessonType.EXAM}},
    icon: (<ExamIcon/>),
    roles: [UserRole.TEACHER]
  },
  {
    key: "task_answers",
    states: [UserState.ACTIVE],
    path: {pathname: STUDENT_TASKS_ANSWERS_PATH(TEACHER())},
    icon: (<AnswersIcon/>),
    roles: [UserRole.TEACHER]
  },
  {
    key: "task_answers_for_student",
    states: [UserState.ACTIVE],
    path: {pathname: STUDENT_TASKS_ANSWERS_PATH(STUDENT())},
    icon: (<AnswersIcon/>),
    roles: [UserRole.STUDENT]
  },
  {
    key: "footnote_list",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    path: {pathname: LIST(FOOTNOTES(TEACHER()))},
    icon: (<OrderedListOutlined/>),
    roles: [UserRole.TEACHER]
  },
  {
    key: "lessons_timetable",
    states: [
      UserState.ACTIVE,
      UserState.ON_VACATION
    ],
    icon: (<CalendarOutlined/>),
    path: {pathname: LESSONS_PATH(TIME_TABLE())},
    roles: [
      UserRole.ULPAN_ADMIN,
      UserRole.TEACHER
    ]
  },
  {
    key: "timetable_exams",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
    roles: [UserRole.ULPAN_ADMIN]
  },
  {
    key: "statistics",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
  },
  {
    key: "results_exams",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
    roles: [UserRole.ULPAN_ADMIN]
  },
  {
    key: "finance",
    states: [UserState.ACTIVE, UserState.ON_VACATION],
    icon: (<LockOutlined/>),
    roles: [UserRole.PROJECT_ADMIN]
  },
  {
    key: "content_of_courses",
    states: [
      UserState.ACTIVE,
      UserState.ON_VACATION
    ],
    icon: (<LockOutlined/>),
    roles: [
      UserRole.PROJECT_ADMIN,
      UserRole.ULPAN_ADMIN
    ]
  },
  {
    key: "content_of_students",
    states: [
      UserState.ACTIVE,
      UserState.ON_VACATION
    ],
    icon: (<LockOutlined/>),
    roles: [
      UserRole.TEACHER,
      UserRole.ULPAN_ADMIN
    ]
  },
  {
    key: "public_content",
    states: [
      UserState.ACTIVE,
      UserState.ON_VACATION
    ],
    icon: (<LockOutlined/>),
    roles: [
      UserRole.PROJECT_ADMIN,
      UserRole.ULPAN_ADMIN
    ]
  },
  {
    key: "comments_and_suggestions",
    states: [
      UserState.ACTIVE,
      UserState.ON_VACATION
    ],
    icon: (<LockOutlined/>),
    roles: [
      UserRole.PROJECT_ADMIN,
      UserRole.ULPAN_ADMIN
    ]
  },
  {
    key: "user_agreement",
    path: {pathname: RoutePath.USER_AGREEMENT()},
    states: [UserState.ACTIVE],
    icon: <BookOutlined/>,
    roles: [
      UserRole.PROJECT_ADMIN,
      UserRole.ULPAN_ADMIN
    ]
  },
  {
    key: "settings",
    path: {pathname: RoutePath.PROFILE_OPTIONS()},
    states: [UserState.ANY],
    icon: (<SettingOutlined/>),
    roles: [UserRole.ANY]
  }
];