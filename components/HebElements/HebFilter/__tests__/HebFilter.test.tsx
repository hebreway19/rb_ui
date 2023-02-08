import { mount } from "enzyme";
import React from "react";
import { Context as ReactResponsiveContext } from "react-responsive";

import { HebFilter, HebFilterSelect } from "..";
import { HebSelect } from "../..";

describe(HebFilter.name, () => {
  describe(HebFilter.name, () => {
    const hebFilterProps = {
      filterCallback: jest.fn(),
      searchOptions: { path: "mockPath", value: "mockValue" },
      
    }
    let mountedWrapper: any;
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
      mountedWrapper = mount(<HebFilter {...hebFilterProps} />)
    });
  
    it("should be defined", () => {
      expect(mountedWrapper).toBeDefined();
      expect(mountedWrapper.type()).toEqual(HebFilter);
    });
  
    it("should be propped", () => {
      Object.keys(hebFilterProps).forEach((fieldName: string) => {
        expect(mountedWrapper.prop(fieldName)).toEqual(hebFilterProps[fieldName]);
      });
    });
  });
  
  describe(HebFilterSelect.name, () => {
    const hebFilterSelectProps = {
      form: {},
      filterTag: "testTag",
      translateTitle: "test translate title",
      options: ["test0", "test1"],
      filterValue: "",
      translateOptions: jest.fn,
      t: jest.fn,
      setValue: jest.fn,
      onSearch: jest.fn
    }
    let mountedWrapper;
    
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
      mountedWrapper = mount(<HebFilterSelect {...hebFilterSelectProps} />)
    });
    
    it("should be defined", () => {
      expect(mountedWrapper).toBeDefined();
      expect(mountedWrapper.type()).toEqual(HebFilterSelect);
    });
    
    it("should be propped", () => {
      Object.keys(hebFilterSelectProps).forEach((fieldName: string) => {
        expect(mountedWrapper.prop(fieldName)).toEqual(hebFilterSelectProps[fieldName]);
      });
    });
    
    it("should be called onChangeEvent", () => {
      expect(mountedWrapper.find(HebSelect).at(0).simulate("change")).toEqual({});
    });
  });
  
  describe(HebFilter.WithDrawer.name, () => {
    const hebFilterWithDrawerProps = {
      onClose: jest.fn(),
      isVisible: true
    }
    
    let mountedMobileWrapper: any;
    let mountedWebWrapper: any;
    
    const mobileOptions = {
      wrappingComponent: ReactResponsiveContext.Provider,
      wrappingComponentProps: { value: { width: 550 } }
    }
    const wepOptions = {
      wrappingComponent: ReactResponsiveContext.Provider,
      wrappingComponentProps: { value: { width: 1550, orientation: "landscape" } }
    }
    
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
  
      mountedMobileWrapper = mount(<HebFilter.WithDrawer {...hebFilterWithDrawerProps} />, mobileOptions);
      mountedWebWrapper = mount(<HebFilter.WithDrawer {...hebFilterWithDrawerProps} />, wepOptions);
    });
  
    it("should be defined", () => {
      expect(mountedMobileWrapper).toBeDefined();
      expect(mountedMobileWrapper.type()).toEqual(HebFilter.WithDrawer);
      expect(mountedWebWrapper).toBeDefined();
      expect(mountedWebWrapper.type()).toEqual(HebFilter.WithDrawer);
    });
  
    it("should be propped", () => {
      Object.keys(hebFilterWithDrawerProps).forEach((fieldName: string) => {
        expect(mountedMobileWrapper.prop(fieldName)).toEqual(hebFilterWithDrawerProps[fieldName]);
      });
      Object.keys(hebFilterWithDrawerProps).forEach((fieldName: string) => {
        expect(mountedWebWrapper.prop(fieldName)).toEqual(hebFilterWithDrawerProps[fieldName]);
      });
    });
  });
});