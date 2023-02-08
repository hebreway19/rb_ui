import { mount } from "enzyme";
import { RouterContext } from "next/dist/shared/lib/router-context";
import React from "react";

import { MobileSettings } from "..";
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

const mountWrapper = (routerValues = {}) => mount(
  <RouterContext.Provider value={createMockRouter(routerValues)}>
    <AuthProvider jwt={"jwt"}>
      <LanguageProvider>
       <FontFamilyProvider>
         <MobileSettings />
       </FontFamilyProvider>
      </LanguageProvider>
    </AuthProvider>
  </RouterContext.Provider>,
  { context: { jwt: "jwt" } });

describe(MobileSettings.name, () => {
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
    wrappedComponent = mountWrapper()
  });
  
  it("should be defined", () => {
    expect(wrappedComponent).toBeDefined();
    expect(wrappedComponent.find(MobileSettings).first().type()).toEqual(MobileSettings);
  })
})