import { mount } from "enzyme";
import React from "react";

import { FrontCard, FrontCardProps } from "../FrontCard";

describe(FrontCard.name, () => {
  const mountWrapper = (props: FrontCardProps) => mount(<FrontCard {...props} />);
  
  [
    {},
    { customFront: (<p>test</p>) }
  ].forEach((props: FrontCardProps) => {
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
      expect(wrappedComponent.type()).toEqual(FrontCard);
    });
    
    it("should be propped", () => {
      Object.keys(props).forEach((propName: string) => {
        expect(wrappedComponent.prop(propName)).toEqual(props[propName]);
      });
    });
  });
});