import { mount } from "enzyme";
import React from "react";

import { HebCheckbox } from "..";

describe(HebCheckbox.name, () => {
  describe(HebCheckbox.name, () => {
    it("create HebCheckbox", () => {
      const inputWrapper = mount(<HebCheckbox>test label</HebCheckbox>);
      const actualNode = inputWrapper.find("label").first();
      expect(actualNode.hasClass("heb-checkbox")).toBe(true);
    });
  
    it("set size small", () => {
      const inputWrapper = mount(<HebCheckbox size="small">test label</HebCheckbox>);
      const actualNode = inputWrapper.find("label").first();
      expect(actualNode.hasClass("heb-checkbox-size__small")).toBe(true);
    });
  
    it("set size default", () => {
      const inputWrapper = mount(<HebCheckbox size="default">test label</HebCheckbox>);
      const actualNode = inputWrapper.find("label").first();
      expect(actualNode.hasClass("heb-checkbox-size__default")).toBe(true);
    });
  })
})