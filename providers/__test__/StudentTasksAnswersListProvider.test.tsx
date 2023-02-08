import { mount } from "enzyme";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import React from "react";

import { AuthProvider, RequestProvider, StudentTasksAnswersListProvider, useStudentTasksAnswersAnswerList } from "..";
import { UserRole } from "../../constants";
import { createMockAuthUser, createMockJwt, createMockRouter } from "../../test-utils";

jest.mock('jwt-decode', () => () => createMockAuthUser());

const StudentTasksAnswersListViewer = () => {
  const {
    studentTasksAnswersPage, loadStudentTaskAnswersByQueryAndPagination
  } = useStudentTasksAnswersAnswerList();
  return (
    <>
      <p className="studentTasksAnswersPage_totalPages">{studentTasksAnswersPage.totalPages}</p>
      <p className="studentTasksAnswersPage_totalDocs">{studentTasksAnswersPage.totalDocs}</p>
      <p className="studentTasksAnswersPage_page">{studentTasksAnswersPage.page}</p>
      <p className="studentTasksAnswersPage_docs_length">{studentTasksAnswersPage.docs.length}</p>
      <button onClick={() => loadStudentTaskAnswersByQueryAndPagination()}>
        loadStudentTaskAnswersByQueryAndPagination
      </button>
    </>
  )
}

const mountAnswerList = (role: UserRole , routerValues: Partial<NextRouter> = {}, options: any = {}) => {
  const jwt = createMockJwt();
  
  const component = <RouterContext.Provider value={createMockRouter(routerValues)}>
    <AuthProvider jwt={jwt}>
      <RequestProvider>
        <StudentTasksAnswersListProvider role={role}>
          <StudentTasksAnswersListViewer />
        </StudentTasksAnswersListProvider>
      </RequestProvider>
    </AuthProvider>
  </RouterContext.Provider>
  return mount(component, { context: { jwt, role }, ...options });
}

describe(StudentTasksAnswersListProvider.name, () => {
  let studentWrapper;
  let teacherWrapper;
  
  let studentComponent;
  let teacherComponent;
  
  beforeEach(() => {
    studentWrapper = mountAnswerList(UserRole.STUDENT);
    teacherWrapper = mountAnswerList(UserRole.TEACHER, { query: { lessonId: "1" } });
    studentComponent = studentWrapper.find(StudentTasksAnswersListViewer).first();
    teacherComponent = teacherWrapper.find(StudentTasksAnswersListViewer).first();
  });
  
  describe("states", () => {
    it("studentTasksAnswersPage", () => {
      expect(studentComponent.find(".studentTasksAnswersPage_totalPages").text()).toEqual("1");
      expect(studentComponent.find(".studentTasksAnswersPage_totalDocs").text()).toEqual("0");
      expect(studentComponent.find(".studentTasksAnswersPage_page").text()).toEqual("0");
      expect(studentComponent.find(".studentTasksAnswersPage_docs_length").text()).toEqual("0");
    });
  });
  describe("useCallback", () => {
    it("[onClick]", () => {
      const loadStudentTaskAnswersByQueryAndPaginationButton = studentComponent.find('button[children="loadStudentTaskAnswersByQueryAndPagination"]');
      loadStudentTaskAnswersByQueryAndPaginationButton.simulate("click");
      expect(studentComponent.find(".studentTasksAnswersPage_totalPages").text()).toEqual("1");
    });
  });
});