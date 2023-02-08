import { mount } from "enzyme";
import React from "react";

import { HebDropdown } from "..";

describe(HebDropdown.name, () => {
  describe("initial component", () => {
    it("should be defined", () => {
      const component = mount(<HebDropdown overlay={<span>test overlay</span>}><span>test label</span></HebDropdown>);
      expect(component).toBeDefined();
      expect(component.type()).toEqual(HebDropdown);
    });
  
    it("should be className", () => {
      const component = mount(<HebDropdown className="test-class"
                                           overlay={<span>test overlay</span>}><span>test label</span></HebDropdown>);
      expect(component.prop('className')).toBe('test-class');
      expect(component.type()).toEqual(HebDropdown);
    });
  });
});