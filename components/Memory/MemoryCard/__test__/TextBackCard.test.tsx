import { mount } from "enzyme";
import React from "react";
import { TextContent } from "../../../../types";

import { TextBackCard, TextBackCardProps } from "../TextBackCard";

const mountWrapper = (props: TextBackCardProps) => mount(<TextBackCard {...props} />);

describe(TextBackCard.name, () => {
  [
    { content: { he: "test_he" } as TextContent },
    { content: { he_nikkudot: "test_he_nikkudot" } as TextContent },
    { content: { he_nikkudot: "test_he_nikkudot", he: "test_he" } as TextContent }
  ].forEach((props: TextBackCardProps) => {
    let mountedWrapper: any;
    
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
      mountedWrapper = mountWrapper(props);
    });
  
    it("should be defined", () => {
      expect(mountedWrapper).toBeDefined();
      expect(mountedWrapper.type()).toEqual(TextBackCard);
    });

    it("should be propped", () => {
      Object.keys(props).forEach((propName: string) => {
        expect(mountedWrapper.prop(propName)).toEqual(props[propName]);
      });
    });
  });
});