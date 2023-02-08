import { mount } from "enzyme";
import React from "react";
import { MemorySet } from "../../../../../../types";

import { CardContent, CardContentProps } from "../MemorySetList";

const mountWrapper = (props) => mount(<CardContent {...props} />);

describe(CardContent.name, () => {
  [
    {
      isOpen: false,
      isWrong: false,
      onSelectHandle: jest.fn,
      onSetUpdate: jest.fn,
      set: {
        title: "",
        cards: []
      } as MemorySet
    } as CardContentProps,
    {
      isOpen: false,
      isWrong: true,
      onSelectHandle: jest.fn,
      onSetUpdate: jest.fn,
      set: {
        title: "",
        cards: [
          { isEnabled: true }
        ]
      } as MemorySet
    } as CardContentProps,
    {
      isOpen: false,
      isWrong: false,
      onSelectHandle: jest.fn,
      onSetUpdate: jest.fn,
      set: {
        title: ""
      } as MemorySet
    } as CardContentProps
  ].forEach((props: CardContentProps) => {
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
      expect(wrappedComponent.type()).toEqual(CardContent);
    })
  })
})