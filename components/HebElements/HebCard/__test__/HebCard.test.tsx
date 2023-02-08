import { mount } from "enzyme";
import React from "react";

import { HebCard } from "../index";

describe(HebCard.name, () => {
  describe(HebCard.name, () => {
    it("create HebCard", () => {
      const inputWrapper = mount(<HebCard>test</HebCard>);
      const actualNode = inputWrapper.find("div").first();
      expect(actualNode.hasClass("heb-card")).toBe(true);
    });
    
    it("set className", () => {
      const inputWrapper = mount(<HebCard className={"test"}>test</HebCard>);
      const actualNode = inputWrapper.find("div").first();
      expect(actualNode.hasClass("test")).toBe(true);
    });
  });
});