import { mount } from "enzyme";
import React from "react";

import { MobileMenu } from "..";

describe(MobileMenu.name, () => {
  let mountedMobileWrapper: any;
  
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
    mountedMobileWrapper = mount(<MobileMenu />);
  });
  
  it("should be defined", () => {
    expect(mountedMobileWrapper).toBeDefined();
    expect(mountedMobileWrapper.type()).toEqual(MobileMenu);
  });
});