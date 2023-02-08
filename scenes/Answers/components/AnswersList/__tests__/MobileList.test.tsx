import { mount } from "enzyme";
import { RouterContext } from "next/dist/shared/lib/router-context";
import React from "react";
import { LessonType, UserRole } from "../../../../../constants";
import {
  AuthProvider,
  LessonFormProvider,
  RequestProvider,
  StudentTasksAnswersListProvider
} from "../../../../../providers";
import { createMockAuthUser, createMockRouter } from "../../../../../test-utils";
import { StudentTasksAnswers } from "../../../../../types";

import { MobileList, MainList, LessonStartDate, GroupList, LessonList, StudentListItem, LessonListProps } from "../MobileList";

jest.mock('jwt-decode', () => () => createMockAuthUser({ role: UserRole.TEACHER }));

const mountWrapper = (role: UserRole, routerValues: any = {}) => mount(
  <RouterContext.Provider value={createMockRouter(routerValues)}>
    <AuthProvider jwt={"jwt"}>
      <RequestProvider>
        <LessonFormProvider lessonId={"test_id"}
                            type={LessonType.LESSON} >
          <StudentTasksAnswersListProvider role={role}>
            <MobileList />
          </StudentTasksAnswersListProvider>
        </LessonFormProvider>
      </RequestProvider>
    </AuthProvider>
  </RouterContext.Provider>,
  { context: { jwt: "jwt", role, type: LessonType.LESSON, lessonId: "test_id" }});
const mountLessonListWrapper = (props: LessonListProps, routerValues: any = {}) => mount(
  <RouterContext.Provider value={createMockRouter(routerValues)}>
    <AuthProvider jwt={"jwt"}>
      <LessonList {...props} />
    </AuthProvider>
  </RouterContext.Provider>, {context: { jwt: "jwt"}});
const mountStudentListItemWrapper = (props, role: UserRole, routerValues: any = {}) => mount(
  <RouterContext.Provider value={createMockRouter(routerValues)}>
    <AuthProvider jwt={"jwt"}>
      <RequestProvider>
        <LessonFormProvider lessonId={"test_id"}
                            type={LessonType.LESSON} >
          <StudentTasksAnswersListProvider role={role}>
            <StudentListItem {...props} />
          </StudentTasksAnswersListProvider>
        </LessonFormProvider>
      </RequestProvider>
    </AuthProvider>
  </RouterContext.Provider>,
  { context: { jwt: "jwt", role, type: LessonType.LESSON, lessonId: "test_id" }});

describe(MobileList.name, () => {
  describe(MobileList.name, () => {
    let wrappedComponent: any;
    beforeEach(() => {
      global.fetch = jest.fn(() => Promise.resolve({
        json: () => Promise.resolve({
          docs: [],
          page: 0,
          totalDocs: 0,
          totalPages: 1
        })
      })) as jest.Mock;
      Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(), // Deprecated
          removeListener: jest.fn(), // Deprecated
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }))
      });
      wrappedComponent = mountWrapper(UserRole.TEACHER);
    });
    
    it("should be defined", () => {
      expect(wrappedComponent).toBeDefined();
      expect(wrappedComponent.find(MobileList).first().type()).toEqual(MobileList);
    });
  });
  describe(MainList.name, () => {
    const props = {
      setMobileState: jest.fn(),
      user: createMockAuthUser()
    }
    let wrappedComponent: any;
    
    beforeEach(() => {
      wrappedComponent = mount(<MainList {...props} />);
    });
    
    it("should be defined", () => {
      expect(wrappedComponent).toBeDefined();
      expect(wrappedComponent.type()).toEqual(MainList);
    });
    
    it("should be propped", () => {
      Object.keys(props).forEach(propName => {
        expect(wrappedComponent.prop(propName)).toEqual(props[propName]);
      })
    });
  });
  describe(LessonStartDate.name, () => {
    const props = {
      setMobileState: jest.fn(),
      answerList: [
        { lesson: { openFrom: 1318781876 } },
        { lesson: { openFrom: undefined } },
        { lesson: {  } },
        { lesson: { openFrom: 1318782876 } }
      ],
      setSelectedDate: jest.fn()
    }
    let wrappedComponent: any;
    
    beforeEach(() => {
      wrappedComponent = mount(<LessonStartDate { ...props } />);
    });
    
    it("should be defined", () => {
      expect(wrappedComponent).toBeDefined();
      expect(wrappedComponent.type()).toEqual(LessonStartDate);
    });
    
    it("should be propped", () => {
      Object.keys(props).forEach(propName => {
        expect(wrappedComponent.prop(propName)).toEqual(props[propName]);
      });
    });
  });
  describe(GroupList.name, () => {
    const props = {
      answerList: [
        { group: "1318781876" },
        { group: undefined },
        { group: "1318783876" },
        { group: "1318781876" },
      ] as StudentTasksAnswers[],
    }
    let wrappedComponent: any;
    
    beforeEach(() => {
      wrappedComponent = mount(<GroupList {...props} />);
    });
    
    it("should be defined", () => {
      expect(wrappedComponent).toBeDefined();
      expect(wrappedComponent.type()).toEqual(GroupList);
    });
    
    it("should be propped", () => {
      Object.keys(props).forEach(propName => {
        expect(wrappedComponent.prop(propName)).toEqual(props[propName]);
      });
    });
  });
  describe(LessonList.name, () => {
    [
      { props: { answerList: [],
                 selectedDate: 1318781876,
                 redirectToTaskAnswerPageByIdTaskAnswerAndUserRole: jest.fn() },
        mocks: { userRole: UserRole.TEACHER }
      },
      { props: { answerList: undefined,
                 selectedDate: 1318781876,
                 redirectToTaskAnswerPageByIdTaskAnswerAndUserRole: jest.fn() },
        mocks: { userRole: UserRole.TEACHER }
      },
      { props: { answerList: [
                   { lesson: undefined, _id: "answerTestId0" },
                   { lesson: { title: { he: "test" }, _id: "lessonTestId1" }, _id: "answerTestId1" },
                   { lesson: { _id: "lessonTestId2" }, _id: "answerTestId2" },
                   { lesson: { title: { he_nikkudot: "test" }, _id: "lessonTestId3" }, _id: "answerTestId3" },
                   { _id: "answerTestId4" },
                 ] as StudentTasksAnswers[],
                 selectedDate: 1318781876,
                 redirectToTaskAnswerPageByIdTaskAnswerAndUserRole: jest.fn() } as LessonListProps,
        mocks: { userRole: UserRole.STUDENT }
      }
    ].forEach(({props, mocks}) => {
      let mountedComponent: any;
      
      beforeEach(() => {
        jest.mock('jwt-decode', () => () => createMockAuthUser({ role: mocks.userRole }));
        Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // Deprecated
            removeListener: jest.fn(), // Deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          }))
        });
        mountedComponent = mountLessonListWrapper(props);
      })
      it("should be defined", () => {
        expect(mountedComponent).toBeDefined();
        expect(mountedComponent.find(LessonList).first().type()).toEqual(LessonList);
      });
      afterEach(() => {
        jest.clearAllMocks();
      });
    });
  });
  describe(StudentListItem.name, () => {
    [
      { props: { item: {}, role: UserRole.STUDENT, index: 0, selectedIndex: 0, setSelectedIndex: jest.fn() },
        mockData: { userRole: UserRole.STUDENT }
      },
      { props: { item: { openFrom: 1318781876,
                         student: { firstname: "testName",
                                    surname: "testSurname" } },
                 role: UserRole.STUDENT, index: 1, selectedIndex: 0, setSelectedIndex: jest.fn() },
        mockData: { userRole: UserRole.STUDENT }
      },
      { props: { item: {}, role: UserRole.TEACHER, index: 1, selectedIndex: 0, setSelectedIndex: jest.fn() },
        mockData: { userRole: UserRole.TEACHER }
      },
    ].forEach(({props, mockData}) => {
      let mountedWrapper: any;
      
      beforeEach(() => {
        jest.mock('jwt-decode', () => () => createMockAuthUser({ role: mockData.userRole }));
        Object.defineProperty(window, "matchMedia", {
          writable: true,
          value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // Deprecated
            removeListener: jest.fn(), // Deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          }))
        });
        mountedWrapper = mountStudentListItemWrapper(props, mockData.userRole);
      });
      
      it("should be defined", () => {
        expect(mountedWrapper).toBeDefined();
        expect(mountedWrapper.find(StudentListItem).first().type()).toEqual(StudentListItem);
      });
      
      afterEach(() => {
        jest.clearAllMocks()
      })
    })
  });
});