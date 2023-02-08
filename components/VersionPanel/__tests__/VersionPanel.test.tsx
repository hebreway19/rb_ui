import { mount } from "enzyme";
import React from "react";
import { Context as ReactResponsiveContext } from "react-responsive";

import { VersionPanel } from "..";

const mobileOptions = {
  wrappingComponent: ReactResponsiveContext.Provider,
  wrappingComponentProps: { value: { width: 550, height: 720 } }
}
const wepOptions = {
  wrappingComponent: ReactResponsiveContext.Provider,
  wrappingComponentProps: { value: { width: 1550 } }
}

describe(VersionPanel.name, () => {
  let mobileWrapper: any;
  let webWrapper: any;
  
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
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ server: "test" })
    })) as jest.Mock;
    mobileWrapper = mount(<VersionPanel />, mobileOptions);
    webWrapper = mount(<VersionPanel />, wepOptions);
  });
  
  it("should be defined", () => {
    expect(mobileWrapper).toBeDefined();
    expect(mobileWrapper.type()).toEqual(VersionPanel);
    expect(webWrapper).toBeDefined();
    expect(webWrapper.type()).toEqual(VersionPanel);
  });
  
  it("should be show empty version", () => {
    expect(mobileWrapper.find('span').first().text()).toEqual("Client v.- Server v.-")
    expect(webWrapper.find('span').first().text()).toEqual('Client v.- Server v.-')
  });
});