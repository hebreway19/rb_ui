import { mount } from "enzyme";
import React from "react";
import { AuthProvider, RequestProvider } from "../../../../../../providers";
import { createMockAuthUser, createMockFile } from "../../../../../../test-utils";

import {MemoryCardAudioRecorder} from "../CustomCardContent/MemoryCardAudioRecorder";

jest.mock('jwt-decode', () => () => createMockAuthUser({}))

describe(MemoryCardAudioRecorder.name, () => {
  let wrappedComponent: any;
  
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ blob: createMockFile("file", 20, "audio/mp3") }),
      }),
    ) as jest.Mock;
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
    wrappedComponent = mount(<AuthProvider jwt={""}>
                               <RequestProvider>
                                 <MemoryCardAudioRecorder onDone={jest.fn} />
                               </RequestProvider>
                             </AuthProvider>)
  });
  
  it("should be defined", () => {
    expect(wrappedComponent).toBeDefined();
    expect(wrappedComponent.find(MemoryCardAudioRecorder).first().type()).toEqual(MemoryCardAudioRecorder);
  });
});