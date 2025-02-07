import { render, screen } from "@testing-library/react";
import { SpeechProvider, useSpeech } from "../Context/SpeechContext";
import { act } from "react-dom/test-utils";
import { useState } from "react";


test("useSpeech throws an error when used outside SpeechProvider", () => {
  expect(() => {
    useSpeech();
  }).toThrow("useSpeech must be used");
});


describe("SpeechProvider", () => {
  let TestComponent;

  beforeEach(() => {
    TestComponent = () => {
      const { speechToText, addSpeech, isSpeechEable, toggleSpeech } =
        useSpeech();
      return (
        <div>
          <p data-testid="speech-text">{speechToText}</p>
          <p data-testid="speech-enabled">
            {isSpeechEable ? "enabled" : "disabled"}
          </p>
          <button onClick={() => addSpeech("Hello World")}>Add Speech</button>
          <button onClick={toggleSpeech}>Toggle Speech</button>
        </div>
      );
    };
  });

  test("initial values are correct", () => {
    render(
      <SpeechProvider>
        <TestComponent />
      </SpeechProvider>
    );

    expect(screen.getByTestId("speech-text").textContent).toBe("");
    expect(screen.getByTestId("speech-enabled").textContent).toBe("enabled");
  });

  test("addSpeech updates speechToText", () => {
    render(
      <SpeechProvider>
        <TestComponent />
      </SpeechProvider>
    );

    act(() => {
      screen.getByText("Add Speech").click();
    });

    expect(screen.getByTestId("speech-text").textContent).toBe("Hello World");
  });

  test("toggleSpeech toggles isSpeechEable", () => {
    render(
      <SpeechProvider>
        <TestComponent />
      </SpeechProvider>
    );

    act(() => {
      screen.getByText("Toggle Speech").click();
    });

    expect(screen.getByTestId("speech-enabled").textContent).toBe("disabled");

    act(() => {
      screen.getByText("Toggle Speech").click();
    });

    expect(screen.getByTestId("speech-enabled").textContent).toBe("enabled");
  });
});
