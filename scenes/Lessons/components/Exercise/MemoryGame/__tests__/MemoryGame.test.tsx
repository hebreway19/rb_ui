import { mount } from "enzyme";
import React from "react";

import { MemoryGame } from "../.";
import { LanguageProvider } from "../../../../../../providers";
import { TeacherForm } from "../TeacherForm";
import { StudentForm } from "../StudentForm";
import { UserRole } from "../../../../../../constants";

const mountWrapper = (props) => mount(
  <LanguageProvider><MemoryGame {...props} /></LanguageProvider>);

describe(MemoryGame.name, () => {
  [
    { props: { role: UserRole.STUDENT }, expected: { exerciseFrom: StudentForm } },
    { props: { role: UserRole.TEACHER, sets: [], setIsExerciseHasErrors: jest.fn, updateExerciseByTaskIndexAndExerciseType: jest.fn }, expected: { exerciseFrom: TeacherForm } },
  ].forEach(({props, expected}) => {
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
      wrappedComponent = mountWrapper(props);
    });
    
    it("should be defined", () => {
      expect(wrappedComponent).toBeDefined();
      expect(wrappedComponent.find(MemoryGame).first().type()).toEqual(MemoryGame);
    });
    
    it("should be propped", () => {
      Object.keys(props).forEach((propName: string) => {
        expect(wrappedComponent.find(MemoryGame).first().prop(propName)).toEqual(props[propName]);
      });
    });
    
    it(`should be called ${expected.exerciseFrom.name}`, () => {
      expect(wrappedComponent.find(expected.exerciseFrom).first().type()).toEqual(expected.exerciseFrom);
    });
  });
});