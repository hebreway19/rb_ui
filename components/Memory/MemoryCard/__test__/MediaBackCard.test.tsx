import { mount } from "enzyme";
import React from "react";
import { createMockFile } from "../../../../test-utils";

import { MediaBackCard } from "../MediaBackCard";

const mountWrapper = (props) => mount(<MediaBackCard {...props} />);

describe(MediaBackCard.name, () => {
  [
    {
      props: { content: { _id: "testId", mimeType: "image/jpeg", src: "test_src" } },
      fetchResponse: Promise.resolve({
        status: 400,
        json: () => Promise.resolve({
          success: false,
          error: 'Something bad happened' }),
      })
    },
    {
      props: { content: { _id: "testId", mimeType: "image/mpeg", src: "test_src" } },
      fetchResponse: Promise.resolve({
        status: 200,
        json: () => Promise.resolve(createMockFile("test.mp3",
          1024,
          "audio/mpeg"))
      })
    }
  ].forEach(({props, fetchResponse}) => {
    const defaultFetch = global.fetch;
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
      global.fetch = jest.fn(() => fetchResponse) as jest.Mock;
      mountedWrapper = mountWrapper(props);
    });
    
    it("should be defined", () => {
      expect(mountedWrapper).toBeDefined();
      expect(mountedWrapper.type()).toEqual(MediaBackCard);
    });
    
    afterAll(() => {
      global.fetch = defaultFetch;
    });
  });
});