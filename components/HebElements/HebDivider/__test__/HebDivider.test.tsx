import { mount } from "enzyme";
import React from "react";

import { HebDivider } from "..";

describe(HebDivider.name, () => {
  describe(HebDivider.name, () => {
    it("create HebDivider", () => {
      const inputWrapper = mount(<HebDivider>test label</HebDivider>);
      const actualNode = inputWrapper.find("div").first();
      expect(actualNode.hasClass("heb-divider")).toBe(true);
    });
  
    it("set className", () => {
      const inputWrapper = mount(<HebDivider className={'test'}>test label</HebDivider>);
      const actualNode = inputWrapper.find("div").first();
      expect(actualNode.hasClass("test")).toBe(true);
    });
  
    it("set covers", () => {
      const inputWrapper = mount(<HebDivider covers={true}>test label</HebDivider>);
      const actualNode = inputWrapper.find("div").first();
      expect(actualNode.hasClass("heb-divider-covers")).toBe(true);
    });
  });
});