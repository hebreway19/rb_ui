import { mount } from "enzyme";
import React from "react";
import { TaskContentType } from "../../../../../../constants";

import { MemoryProps, MemorySet } from "../MemorySet";
import { MediaContent, MemoryCard as MemoryCardType, TextContent } from "../../../../../../types";

const mountWrapper = (props: MemoryProps) => mount(<MemorySet {...props} />);

describe(MemorySet.name, () => {
  [
    { props: { memorySet: { cards: [] as MemoryCardType[],
                            title: "test string"
                          } } as MemoryProps },
    { props: { memorySet: { cards: [] as MemoryCardType[], } } as MemoryProps },
    { props: { memorySet: { cards: [
                                     { isEnabled: false } as MemoryCardType,
                                     { content: { he: "", he_nikkudot: "", __t: TaskContentType.TextContent, isVisibleForStudents: true } as TextContent, isEnabled: false } as MemoryCardType,
                                     { content: { _id: "test", mimeType: "image", __t: TaskContentType.MediaContent, isVisibleForStudents: true } as MediaContent, isEnabled: false } as MemoryCardType<MediaContent>,
                                     { content: { _id: "test", mimeType: "audio", __t: TaskContentType.MediaContent, isVisibleForStudents: true } as MediaContent, isEnabled: false } as MemoryCardType<MediaContent>,
                                     { content: { mimeType: "image", __t: TaskContentType.MediaContent, isVisibleForStudents: true } as MediaContent, isEnabled: false } as MemoryCardType<MediaContent>,
                                     { content: { mimeType: "image", __t: TaskContentType.MediaContent, isVisibleForStudents: true } as MediaContent, isEnabled: false } as MemoryCardType<MediaContent>,
                                   ] as MemoryCardType[],
                          } } as MemoryProps },
  ].forEach(({props}) => {
    let wrappedComponent: any;
    
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
      wrappedComponent = mountWrapper(props);
    });
    
    it("should be defined", () => {
      expect(wrappedComponent).toBeDefined();
      expect(wrappedComponent.type()).toEqual(MemorySet);
    });
    it("should be propped", () => {
      Object.keys(props).forEach((propName: string) => {
        expect(wrappedComponent.prop(propName)).toEqual(props[propName]);
      });
    });
  });
});