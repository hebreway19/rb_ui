import { mount } from "enzyme";
import React from "react";
import { Form } from "antd"

import { TextCardContent } from "../CustomCardContent/TextCardContent";

const mountWrapper = (props) => mount(<Form><TextCardContent {...props} /></Form>)

describe(TextCardContent.name, () => {
  [
    { fieldName: "test_field_name", fieldValue: "test text", setFieldValue: jest.fn() },
  ].forEach((props) => {
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
    })
    
    it("should be defined", () => {
      expect(wrappedComponent).toBeDefined();
      expect(wrappedComponent.find(TextCardContent).first().type()).toEqual(TextCardContent);
    });
    
    it("should be propped", () => {
      Object.keys(props).forEach((propName: string) => {
        expect(wrappedComponent.find(TextCardContent).first().prop(propName)).toEqual(props[propName]);
      })
    });
  });
});