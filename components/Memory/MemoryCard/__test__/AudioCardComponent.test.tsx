import { mount } from "enzyme";
import React from "react";
import { createMockFile } from "../../../../test-utils";

import { AudioCardComponent, AudioCardComponentProps, ErrorPlace, PlayerIconComponent, PlayerState } from "../AudioCardComponent";

const mountErrorPlaceWrapper = (props: { errorMessage: string }) => mount(<ErrorPlace {...props} />);
const mountPlayerIconComponentWrapper = (props: {playerState: PlayerState}) => mount(<PlayerIconComponent {...props} />);
const mountAudioCardComponent = (props: AudioCardComponentProps) => mount(<AudioCardComponent {...props} />);


describe(AudioCardComponent.name, () => {
  describe(ErrorPlace.name, () => {
    [
      { errorMessage: "test error message" }
    ].forEach((props: { errorMessage: string }) => {
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
        mountedWrapper = mountErrorPlaceWrapper(props);
      });
  
      it("should be defined", () => {
        expect(mountedWrapper).toBeDefined();
        expect(mountedWrapper.type()).toEqual(ErrorPlace);
      });
  
      it("should be propped", () => {
        Object.keys(props).forEach((propName: string) => {
          expect(mountedWrapper.prop(propName)).toEqual(props[propName]);
        });
      });
    });
  });
  describe(PlayerIconComponent.name, () => {
    [
      { playerState: {
          isLoading: false,
          isPlaying: false,
          isFinish: false,
        }
      },
      { playerState: {
          isLoading: true,
          isPlaying: false,
          isFinish: false,
        }
      },
      { playerState: {
          isLoading: false,
          isPlaying: true,
          isFinish: false,
        }
      },
      { playerState: {
          isLoading: false,
          isPlaying: false,
          isFinish: true,
        }
      },
    ].forEach((props: { playerState: PlayerState }) => {
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
        mountedWrapper = mountPlayerIconComponentWrapper(props);
      });
  
      it("should be defined", () => {
        expect(mountedWrapper).toBeDefined();
        expect(mountedWrapper.type()).toEqual(PlayerIconComponent);
      });
  
      it("should be propped", () => {
        Object.keys(props).forEach((propName: string) => {
          expect(mountedWrapper.prop(propName)).toEqual(props[propName]);
        });
      });
    })
  });
  describe(AudioCardComponent.name, () => {
    [
      {
        props: { dataId: "testId" },
        fetchResponse: Promise.resolve({
                                          status: 400,
                                          json: () => Promise.resolve({
                                            success: false,
                                            error: 'Something bad happened' }),
                                        })
      },
      {
        props: { dataId: "testId" },
        fetchResponse: Promise.resolve({
          status: 200,
          json: () => Promise.resolve(createMockFile("test.mp3",
                                                     1024,
                                                     "audio/mpeg"))
        })
      }
    ].forEach(({ props, fetchResponse }) => {
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
        mountedWrapper = mountAudioCardComponent(props);
      });
      
      it("should be defined", () => {
        expect(mountedWrapper).toBeDefined();
        expect(mountedWrapper.type()).toEqual(AudioCardComponent);
      });
      
      afterEach(() => {
        global.fetch = defaultFetch;
      })
    });
  });
});