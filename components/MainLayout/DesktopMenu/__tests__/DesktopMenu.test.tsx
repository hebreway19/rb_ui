import { mount } from "enzyme";
import React from "react";
import { Context as ReactResponsiveContext } from "react-responsive";

import { DesktopMenu } from "..";

const mobileOptions = {
  wrappingComponent: ReactResponsiveContext.Provider,
  wrappingComponentProps: { value: { width: 550 } }
}
const wepOptions = {
  wrappingComponent: ReactResponsiveContext.Provider,
  wrappingComponentProps: { value: { width: 1550, resolution: "2dppx" } }
}

describe(DesktopMenu.name, () => {
  let mountedMobileWrapper: any;
  let mountedWebWrapper: any;
  
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
    mountedMobileWrapper = mount(<DesktopMenu />, mobileOptions);
    mountedWebWrapper = mount(<DesktopMenu />, wepOptions);
  });
  
  it("should be defined", () => {
    expect(mountedMobileWrapper).toBeDefined();
    expect(mountedMobileWrapper.type()).toEqual(DesktopMenu);
    expect(mountedWebWrapper).toBeDefined();
    expect(mountedWebWrapper.type()).toEqual(DesktopMenu);
  });
});