import { mount } from "enzyme";
import React from "react";

import { HebInput } from "..";

describe(HebInput.name, () => {
  describe(HebInput.name, () => {
    it("set name", () => {
      const inputWrapper = mount(<HebInput name={"test"}/>);
      const actualNode = inputWrapper.find("input").first();
      expect(actualNode.hasClass("heb-input")).toBe(true);
    });
    
    it("set className", () => {
      const inputWrapper = mount(<HebInput className={"test"}/>);
      const actualNode = inputWrapper.find("input").first();
      expect(actualNode.hasClass("test")).toBe(true);
    });
  });
  
  describe(HebInput.Password.name, () => {
    it("set css type as part of className", () => {
      const inputWrapper = mount(<HebInput.Password cssType="primary"/>);
      const actualNode = inputWrapper.find("span").first();
      expect(actualNode.hasClass("heb-input-password-type__primary")).toBe(true);
    });
    
    it("adds cssType to className", () => {
      const inputWrapper = mount(<HebInput.Password cssType="primary" className={"test"}/>);
      const actualNode = inputWrapper.find("span").first();
      expect(actualNode.hasClass("heb-input-password-type__primary")).toBe(true);
      expect(actualNode.hasClass("test")).toBe(true);
    });
  });
  
  describe(HebInput.Search.name, () => {
    it("set className", () => {
      const inputWrapper = mount(<HebInput.Password className={"test"}/>);
      const actualNode = inputWrapper.find("span").first();
      expect(actualNode.hasClass("test")).toBe(true);
    });
    
    it("set css type as part of className", () => {
      const inputWrapper = mount(<HebInput.Search cssType="primary"/>);
      const actualNode = inputWrapper.find("span").first();
      expect(actualNode.hasClass("heb-input-search-type__primary")).toBe(true);
    });
    
    it("set size as part of className", () => {
      const inputWrapper = mount(<HebInput.Search size="large"/>);
      const actualNode = inputWrapper.find("span").first();
      expect(actualNode.hasClass("heb-input-search-size__large")).toBe(true);
    });
  });
  
  describe(HebInput.Email.name, () => {
    it("set css type as part of className", () => {
      const inputWrapper = mount(<HebInput.Email cssType="primary"/>);
      const actualNode = inputWrapper.find("input").first();
      expect(actualNode.hasClass("heb-input-search-type__primary")).toBe(true);
    });
    
    it("set size as part of className", () => {
      const inputWrapper = mount(<HebInput.Email size="large"/>);
      const actualNode = inputWrapper.find("input").first();
      expect(actualNode.hasClass("heb-input-search-size__large")).toBe(true);
    });
  });
})
