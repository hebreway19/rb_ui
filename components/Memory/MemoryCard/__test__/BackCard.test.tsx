import { mount } from "enzyme";
import React from "react";
import { MemoryCardType } from "../../../../constants";
import { TextMemoryCard } from "../../../../types";

import { BackCard, BackCardBuilder, BackCardProps } from "../BackCard";
import { MediaBackCard } from "../MediaBackCard";

import { TextBackCard } from "../TextBackCard";

const mountWrapper = (props: BackCardProps) => mount(<BackCard {...props} />);

describe(BackCard.name, () => {
  describe(BackCardBuilder.name, () => {
    [
      { type :MemoryCardType.TextMemoryCard, expectedComponent: TextBackCard },
      { type :MemoryCardType.MediaMemoryCard, expectedComponent: MediaBackCard },
    ].forEach(({ type, expectedComponent }) => {
      it(`should be tp equal ${expectedComponent.name}`, () => {
        expect(BackCardBuilder.build(type).name).toEqual(expectedComponent.name);
      })
    });
  });
  describe(BackCard.name, () => {
    [
      {},
      {
        customBody: <p>test</p>
      },
      {
        card: {
          isEnabled: true,
          __t: MemoryCardType.TextMemoryCard,
          content: { he_nikkudot: "test_he_nikkudot", he: "test_he" }
        } as TextMemoryCard
      }
    ].forEach((props: BackCardProps) => {
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
        mountedWrapper = mountWrapper(props);
      });
      
      it("should be defined", () => {
        expect(mountedWrapper).toBeDefined();
        expect(mountedWrapper.type()).toEqual(BackCard);
      });
      
      it("should be propped", () => {
        Object.keys(props).forEach((propName: string) => {
          expect(mountedWrapper.prop(propName)).toEqual(props[propName]);
        });
      });
    })
  });
});