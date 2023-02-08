import { mount } from "enzyme";
import React from "react";

import { MemoryCard, MemoryCardProps } from "../.";

const mountWrapper = (props) => mount(<MemoryCard {...props} />);

describe(MemoryCard.name, () => {
  [
    { customBody: (<></>) } as MemoryCardProps,
    { customBody: (<></>), isOpen: false } as MemoryCardProps,
    { customBody: (<></>), isOpen: true } as MemoryCardProps
  ].forEach((props: MemoryCardProps) => {
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
      expect(wrappedComponent.type()).toEqual(MemoryCard);
    })
  });
});