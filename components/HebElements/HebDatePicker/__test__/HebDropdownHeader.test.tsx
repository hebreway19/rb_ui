import { mount, shallow } from "enzyme";
import React from "react";

import { DropdownHeader } from "..";

describe(DropdownHeader.name, () => {
  const mockProps = {
    selectedYear: 1999,
    selectedMonth: 10,
    selectYear: jest.fn(),
    selectMonth: jest.fn()
  }
  
  let component;
  describe('initial component', () => {
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
      component = mount(<DropdownHeader {...mockProps} />);
    })
    
    it("should be defined", () => {
      expect(component).toBeDefined();
      expect(component.type()).toEqual(DropdownHeader);
    });
    
    it("should properly render accepted props", () => {
      Object.keys(mockProps).forEach((propName: string) => {
        expect(component.prop(propName)).toEqual(mockProps[propName]);
      });
    });
    
    it("test year clicks events", () => {
      const shallowComponent = shallow(<DropdownHeader {...mockProps} />)
      let years: number[] = [];
      for (let i = new Date().getFullYear(); i > new Date().getFullYear() - 100; i--) {
        years.push(i);
      }
      years.forEach((year, index) => {
        const optionComponent = shallowComponent.find(`.year-${index}`).first();
        optionComponent.simulate('click')
      });
      expect(mockProps.selectYear.mock.calls.length).toEqual(years.length);
    });
    
    it("test month clicks events", () => {
      const shallowComponent = shallow(<DropdownHeader {...mockProps} />)
      const months = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 ];
      months.forEach((year, index) => {
        const optionComponent = shallowComponent.find(`.month-${index}`).first();
        optionComponent.simulate('click')
      });
      expect(mockProps.selectMonth.mock.calls.length).toEqual(months.length);
    })
  });
});