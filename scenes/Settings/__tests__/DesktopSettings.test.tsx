import { mount } from "enzyme";
import { RouterContext } from "next/dist/shared/lib/router-context";
import { Context as ReactResponsiveContext } from "react-responsive";
import React from "react";

import { DesktopSettings } from "..";
import { UserRole } from "../../../constants";
import { AuthProvider, FontFamilyProvider, LanguageProvider } from "../../../providers";
import { createMockAuthUser, createMockRouter } from "../../../test-utils";

jest.mock('jwt-decode', () => () => createMockAuthUser({ role: UserRole.TEACHER }));
jest.mock('next/router', () => ({
  isReady: true,
  pathname: "/",
  asPath: '/',
  push: jest.fn(),
  useRouter: () => createMockRouter({}),
}));

const smallDesktopOptions = {
  wrappingComponent: ReactResponsiveContext.Provider,
  wrappingComponentProps: { value: { width: 550, height: 720 } }
}
const desktopOptions = {
  wrappingComponent: ReactResponsiveContext.Provider,
  wrappingComponentProps: { value: { width: 1550 } }
}

const mountWrapper = (options = {}, routerValues = {}) => mount(
  <RouterContext.Provider value={createMockRouter(routerValues)}>
    <AuthProvider jwt={"jwt"}>
      <LanguageProvider>
        <FontFamilyProvider>
          <DesktopSettings />
        </FontFamilyProvider>
      </LanguageProvider>
    </AuthProvider>
  </RouterContext.Provider>,
  { ...options, context: { jwt: "jwt" } })

describe(DesktopSettings.name, () => {
  let smallDesktopWrapper: any;
  let desktopWrapper: any;
  
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
    smallDesktopWrapper = mountWrapper(smallDesktopOptions);
    desktopWrapper = mountWrapper(desktopOptions);
  });
  
  it("should be defined", () => {
    expect(smallDesktopWrapper).toBeDefined();
    expect(smallDesktopWrapper.find(DesktopSettings).first().type()).toEqual(DesktopSettings);
    expect(desktopWrapper).toBeDefined();
    expect(desktopWrapper.find(DesktopSettings).first().type()).toEqual(DesktopSettings);
  });
});