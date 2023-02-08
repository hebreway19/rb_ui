import { mount } from "enzyme";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { NextRouter } from "next/router";
import React from "react";

import { AnswersList } from "..";
import { UserRole } from "../../../../../constants";
import { AuthProvider, RequestProvider, StudentTasksAnswersListProvider } from "../../../../../providers";
import { createMockRouter, createMockAuthUser } from "../../../../../test-utils";

jest.mock('jwt-decode', () => () => createMockAuthUser());

describe(AnswersList.name, () => {
  const mountAnswerList = (props: { role: UserRole }, routerValues: Partial<NextRouter> = {}, options: any = {}) => {
    const jwt = "jwt";
    
    const component = <RouterContext.Provider value={createMockRouter(routerValues)}>
      <AuthProvider jwt={jwt}>
        <RequestProvider>
          <StudentTasksAnswersListProvider role={props.role}>
            <AnswersList {...props} />
          </StudentTasksAnswersListProvider>
        </RequestProvider>
      </AuthProvider>
    </RouterContext.Provider>
    return mount(component, { context: { jwt, role: props.role }, ...options });
  }
  
  const studentAnswersListProps = { role: UserRole.STUDENT };
  const teacherAnswersListProps = { role: UserRole.TEACHER };
  const wrongRoleAnswerListProps = { role: UserRole.ANY };
  
  let studentWrapper;
  let teacherWrapper;
  let wrongRoleWrapper;
  
  describe("initial component", () => {
    beforeEach(async () => {
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
      
      studentWrapper = mountAnswerList(studentAnswersListProps);
      teacherWrapper = mountAnswerList(teacherAnswersListProps);
      wrongRoleWrapper = mountAnswerList(wrongRoleAnswerListProps);
    });
    
    it("should be defined", () => {
      expect(studentWrapper).toBeDefined();
      expect(studentWrapper.find(AnswersList).type()).toEqual(AnswersList);
      expect(teacherWrapper).toBeDefined();
      expect(teacherWrapper.find(AnswersList).type()).toEqual(AnswersList);
      expect(wrongRoleWrapper).toBeDefined();
      expect(wrongRoleWrapper.find(AnswersList).type()).toEqual(AnswersList);
    });
    
    it("should properly render accepted props", () => {
      Object.keys(studentAnswersListProps).forEach((propName: string) => {
        expect(studentWrapper.find(AnswersList).prop(propName)).toEqual(studentAnswersListProps[propName]);
      });
      Object.keys(teacherAnswersListProps).forEach((propName: string) => {
        expect(teacherWrapper.find(AnswersList).prop(propName)).toEqual(teacherAnswersListProps[propName]);
      });
      Object.keys(wrongRoleAnswerListProps).forEach((propName: string) => {
        expect(wrongRoleWrapper.find(AnswersList).prop(propName)).toEqual(wrongRoleAnswerListProps[propName]);
      });
    });
  });
});