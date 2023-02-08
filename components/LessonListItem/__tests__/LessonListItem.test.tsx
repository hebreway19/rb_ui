import { mount } from "enzyme";
import React from "react";

import { LessonListItem, LessonListItemProps } from "..";
import { AccessType, HebrewProficiency, LanguageCode, LessonType } from "../../../constants";
import { Task } from "../../../types";


describe(LessonListItem.name, () => {
  const mockLessonListItemProps: LessonListItemProps = {
    onDelete: jest.fn(),
    _id: "000",
    title: {
      he: "Test",
      he_nikkudot: "Test!"
    },
    __t: LessonType.LESSON,
    accessType: AccessType.GROUP,
    author: "001",
    type: LessonType.LESSON,
    openFrom: 1651767577,
    openTo: 165179000,
    studentsHebrewProficiency: HebrewProficiency.ALEF,
    isMediaContentVisibleForStudent: true,
    studentsNativeLanguage: LanguageCode.RU,
    tasks: [
      {} as Task
    ]
  }
  let component;
  
  describe("initial component", () => {
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
      component = mount(<LessonListItem {...mockLessonListItemProps} />);
    });
    
    it("to be defined", () => {
      expect(component).toBeDefined();
      expect(component.type()).toEqual(LessonListItem);
    });
  
    it("should properly render accepted props", () => {
      Object.keys(mockLessonListItemProps).forEach((propName) => {
        expect(component.prop(propName)).toEqual(mockLessonListItemProps[propName]);
      });
    });
  });
});