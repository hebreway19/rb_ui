import { mount } from "enzyme";
import moment from "moment";
import { I18nContext } from "next-i18next";
import React from "react";

import { HebDatePicker } from "..";

describe(HebDatePicker.name, () => {
  const wrappedOptions = {
    wrappingComponent: I18nContext.Provider
  }
  const mockProps = {
    className: 'test-class-name',
    type: 'default',
    value: moment()
  };
  let component;
  describe('initial component', () => {
    beforeEach(() => {
      component = mount(<HebDatePicker {...mockProps}/>, wrappedOptions);
    });
    
    it("should be defined", () => {
      const emptyComponent = mount(<HebDatePicker/>, wrappedOptions);
      expect(emptyComponent).toBeDefined();
      expect(emptyComponent.type()).toEqual(HebDatePicker);
      expect(component).toBeDefined();
      expect(component.type()).toEqual(HebDatePicker);
    });
  });
});