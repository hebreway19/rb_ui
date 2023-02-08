import { mount } from "enzyme";
import { NextRouter } from "next/router";
import React from "react";
import { Context as ReactResponsiveContext } from "react-responsive";
import { RouterContext } from "next/dist/shared/lib/router-context";

import { MainLayout } from "..";
import { AuthProvider } from "../../../providers";
import { createMockJwt, createMockRouter } from "../../../test-utils";

const mobileOptions = {
  wrappingComponent: ReactResponsiveContext.Provider,
  wrappingComponentProps: { value: { width: 550 } }
}
const wepOptions = {
  wrappingComponent: ReactResponsiveContext.Provider,
  wrappingComponentProps: { value: { width: 1550 } }
}

const mountWrapper = (options, router: Partial<NextRouter> = {}) => mount(
  <AuthProvider jwt={createMockJwt()}>
    <RouterContext.Provider value={createMockRouter(router)}>
      <MainLayout><h3>children</h3></MainLayout>
    </RouterContext.Provider>
  </AuthProvider>, options)

describe(MainLayout.name, () => {
  let mountedMobileWrapper: any;
  let mountedWebWrapper: any;
  
  beforeEach(() => {
    mountedMobileWrapper = mountWrapper(mobileOptions);
    mountedWebWrapper = mountWrapper(wepOptions)
  });
  
  it("should be defined", () => {
    expect(mountedMobileWrapper).toBeDefined();
    expect(mountedMobileWrapper.find(MainLayout).type()).toEqual(MainLayout);
    expect(mountedWebWrapper).toBeDefined();
    expect(mountedWebWrapper.find(MainLayout).type()).toEqual(MainLayout);
  });
});