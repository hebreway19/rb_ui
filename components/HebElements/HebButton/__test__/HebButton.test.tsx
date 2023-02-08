import { mount } from "enzyme";
import React from "react";

import { HebButton } from "..";

describe(HebButton.name, () => {
  describe(HebButton.name, () => {
    it("set className", () => {
      const inputWrapper = mount(<HebButton className={"test"}/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("heb-button")).toBe(true);
    });
  
    it("set viewType default", () => {
      const inputWrapper = mount(<HebButton viewType="default"/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("heb-button__default")).toBe(true);
    });
  
    it("set viewType text", () => {
      const inputWrapper = mount(<HebButton viewType="text"/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("heb-button__text")).toBe(true);
    });
  
    it("set viewType primary", () => {
      const inputWrapper = mount(<HebButton viewType="primary"/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("heb-button__primary")).toBe(true);
    });
  
    it("set viewType primary-v2", () => {
      const inputWrapper = mount(<HebButton viewType="primary-v2"/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("heb-button__primary-v2")).toBe(true);
    });
  
    it("set viewType secondary", () => {
      const inputWrapper = mount(<HebButton viewType="secondary"/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("heb-button__secondary")).toBe(true);
    });
    
    it("set buttonSizes over-small", () => {
      const inputWrapper = mount(<HebButton buttonSize="over-small"/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("heb-button-size__over-small")).toBe(true);
    });
  
    it("set buttonSizes small", () => {
      const inputWrapper = mount(<HebButton buttonSize="small"/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("heb-button-size__small")).toBe(true);
    });
  
    it("set buttonSizes middle", () => {
      const inputWrapper = mount(<HebButton buttonSize="middle"/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("heb-button-size__middle")).toBe(true);
    });
  
    it("set overText", () => {
      const inputWrapper = mount(<HebButton overText={true}/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("over-text")).toBe(true);
    });
  
    it("set indicatorLine", () => {
      const inputWrapper = mount(<HebButton indicatorLine={false}/>);
      const actualNode = inputWrapper.find("button").first();
      expect(actualNode.hasClass("without-indicator")).toBe(true);
    });
  });
});