import { mount } from "enzyme";
import React from "react";
import { LessonType, UserRole } from "../../../../../constants";
import { AuthProvider } from "../../../../../providers";
import { createMockAuthUser } from "../../../../../test-utils";

import { Controls, TagStatus, checkAnswerStatus } from "../Controls";

jest.mock('jwt-decode', () => () => createMockAuthUser());

const mountTagStatusComponent = (props) => mount(<TagStatus {...props} />);
const mountControlsComponent = (props) => mount(<AuthProvider jwt={""}><Controls {...props} /></AuthProvider>);

describe(Controls.name, () => {
  describe(TagStatus.name, () => {
    [
      {
        isFileAnswer: false,
        answerContent: {},
        isTouched: false
      },
      {
        isFileAnswer: false,
        answerContent: {
          points: 1,
          exercise: {
            isAutomaticallyChecked: false
          }
        },
        reviewedBy: "testId",
        isTouched: false
      },
      {
        isFileAnswer: false,
        answerContent: {
          points: 0,
          exercise: {
            isAutomaticallyChecked: true
          }
        },
        reviewedBy: "testId",
        isTouched: false
      }
    ].forEach(props => {
      let wrappedComponent: any;
  
      beforeEach(() => {
        wrappedComponent = mountTagStatusComponent(props);
      });
  
      it("should be defined", () => {
        expect(wrappedComponent).toBeDefined();
        expect(wrappedComponent.type()).toEqual(TagStatus);
      })
      
      it("should be propped", () => {
        Object.keys(props).forEach(propName => {
          expect(wrappedComponent.prop(propName)).toEqual(props[propName]);
        })
      })
    })
    
  });
  describe(Controls.name, () => {
    [
      {
        role: UserRole.TEACHER,
        answerIndex: 0,
        answerContent: {
          points: 1,
          exercise: {
            isAutomaticallyChecked: false
          },
          teacherComment: "test"
        },
        isTouched: false,
        setIsTouched: jest.fn(),
        reviewedBy: "",
        lessonType: LessonType.LESSON,
        handleTaskAnswerChange: jest.fn(),
        isFileAnswer: false,
      },
      {
        role: UserRole.TEACHER,
        answerIndex: 0,
        answerContent: {},
        isTouched: false,
        setIsTouched: jest.fn(),
        reviewedBy: "",
        lessonType: LessonType.LESSON,
        handleTaskAnswerChange: jest.fn(),
        isFileAnswer: false,
      }
    ].forEach(props => {
      let wrappedComponent: any;
  
      beforeEach(() => {
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
        wrappedComponent = mountControlsComponent(props);
      });
  
      it("should be defined", () => {
        expect(wrappedComponent).toBeDefined();
        expect(wrappedComponent.find(Controls).first().type()).toEqual(Controls);
      })
  
      it("should be propped", () => {
        Object.keys(props).forEach(propName => {
          expect(wrappedComponent.find(Controls).first().prop(propName)).toEqual(props[propName]);
        })
      })
    })
  });
  describe(checkAnswerStatus.name, () => {
    [
      {
        args: {
          isFileAnswer: false,
          points: 1,
          isTouched: true,
          reviewBy: "",
          isAutomaticallyChecked: true,
          resultChildren: {
            correct: "correct",
            wrong: "wrong",
            other: "other"
          }
        },
        expectedResult: "correct"
      },
      {
        args: {
          isFileAnswer: true,
          points: 0,
          isTouched: false,
          reviewBy: "test",
          isAutomaticallyChecked: true,
          resultChildren: {
            correct: "correct",
            wrong: "wrong",
            other: "other"
          }
        },
        expectedResult: "wrong"
      },
      {
        args: {
          isFileAnswer: true,
          points: 0,
          isTouched: false,
          reviewBy: undefined,
          isAutomaticallyChecked: true,
          resultChildren: {
            correct: "correct",
            wrong: "wrong",
            other: "other"
          }
        },
        expectedResult: "other"
      },
      {
        args: {
          isFileAnswer: false,
          points: 0,
          isTouched: true,
          reviewBy: undefined,
          isAutomaticallyChecked: false,
          resultChildren: {
            correct: "correct",
            wrong: "wrong",
            other: "other"
          }
        },
        expectedResult: "wrong"
      }
    ].forEach(({ expectedResult,
                 args: {
                   isFileAnswer,
                   points,
                   isTouched,
                   reviewBy,
                   isAutomaticallyChecked,
                   resultChildren
                 } }) => {
      it(`should be return ${expectedResult}`, () => {
        expect(checkAnswerStatus(isFileAnswer,
                                 points,
                                 isTouched,
                                 reviewBy,
                                 isAutomaticallyChecked,
                                 resultChildren)).toEqual(expectedResult);
      })
    });
  });
});