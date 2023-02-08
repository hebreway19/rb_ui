import { mount } from "enzyme";
import { Context as ReactResponsiveContext } from "react-responsive";
import React from "react";

import { HebDrawer, HebDrawerProps } from "..";

describe(HebDrawer.name, () => {
  const mockChildren = <p>test child</p>
  const props: HebDrawerProps = {
    onClose: jest.fn(),
    children: mockChildren
  }
  const mobileOptions = {
                          wrappingComponent: ReactResponsiveContext.Provider,
                          wrappingComponentProps: { value: { width: 550 } }
                        }
  const wepOptions = {
                       wrappingComponent: ReactResponsiveContext.Provider,
                       wrappingComponentProps: { value: { width: 1550 } }
                     }
                     
  let mountedComponentMobile;
  let mountedComponentWeb;
  
  const mountComponentMobile = (props: HebDrawerProps = {}) => mount(<HebDrawer {...props} />, mobileOptions);
  const mountComponentWeb = (props: HebDrawerProps = {}) => mount(<HebDrawer {...props} />, wepOptions);
  
  describe("initial component", () => {
    
    beforeEach(() => {
      mountedComponentMobile = mountComponentMobile(props);
      mountedComponentWeb = mountComponentWeb(props);
    });
    
    it("should be defined", () => {
      expect(mountedComponentMobile).toBeDefined()
      expect(mountedComponentMobile.type()).toEqual(HebDrawer);
      expect(mountedComponentWeb).toBeDefined();
      expect(mountedComponentWeb.type()).toEqual(HebDrawer);
    });
    
    it("should properly render accepted props", () => {
      Object.keys(props).forEach((propName: string) => {
        expect(mountedComponentMobile.prop(propName)).toEqual(props[propName]);
      });
      Object.keys(props).forEach((propName: string) => {
        expect(mountedComponentWeb.prop(propName)).toEqual(props[propName]);
      });
    });
  });
});