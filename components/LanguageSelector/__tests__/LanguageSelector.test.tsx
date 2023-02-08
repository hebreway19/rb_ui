import { mount } from "enzyme";
import { RouterContext } from "next/dist/shared/lib/router-context";
import React from "react";
import { Context as ReactResponsiveContext } from "react-responsive";

import { LanguageSelector } from "..";
import { UserRole } from "../../../constants";
import { AuthProvider, LanguageProvider } from "../../../providers";
import { createMockAuthUser, createMockRouter } from "../../../test-utils";

jest.mock('jwt-decode', () => () => createMockAuthUser({ role: UserRole.TEACHER }))
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
        <LanguageSelector />
      </LanguageProvider>
    </AuthProvider>
  </RouterContext.Provider>,
  { ...options, context: { jwt: "jwt" } });

describe(LanguageSelector.name, () => {
  [
    { user: createMockAuthUser({ role: UserRole.TEACHER }) },
    { user: undefined }
  ].forEach((mockData, index) => {
    jest.mock('jwt-decode', () => () => mockData.user);
    
    let smallScreenWrapper: any;
    let defaultScreenWrapper: any;
  
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
      smallScreenWrapper = mountWrapper(smallDesktopOptions);
      defaultScreenWrapper = mountWrapper(desktopOptions);
    });
    it("should be defined", () => {
      expect(smallScreenWrapper).toBeDefined();
      expect(smallScreenWrapper.find(LanguageSelector).first().type()).toEqual(LanguageSelector);
      expect(defaultScreenWrapper).toBeDefined();
      expect(defaultScreenWrapper.find(LanguageSelector).first().type()).toEqual(LanguageSelector);
    });
  });
});