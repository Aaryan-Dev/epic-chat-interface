import { render, screen, fireEvent } from "@testing-library/react";
import SpeechInput from "../components/ChatContainer/SpeechInput";
import { SpeechProvider, useSpeech } from "../Context/SpeechContext";

describe("SpeechInput Component", () => {
  let mockAddSpeech;

  beforeEach(() => {
    mockAddSpeech = jest.fn();

    jest.spyOn(window, "SpeechRecognition", "get").mockReturnValue(
      class {
        constructor() {
          this.continuous = false;
          this.interimResults = false;
          this.lang = "";
        }
        start = jest.fn();
        stop = jest.fn();
        onresult = jest.fn();
        onerror = jest.fn();
        onend = jest.fn();
      }
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders SpeechInput component", () => {
    render(
      <SpeechProvider>
        <SpeechInput />
      </SpeechProvider>
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("starts listening when microphone button is clicked", () => {
    render(
      <SpeechProvider>
        <SpeechInput />
      </SpeechProvider>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(window.recognition.start).toHaveBeenCalled();
  });

  test("stops listening when microphone button is clicked again", () => {
    render(
      <SpeechProvider>
        <SpeechInput />
      </SpeechProvider>
    );

    const button = screen.getByRole("button");
    fireEvent.click(button);
    fireEvent.click(button);

    expect(window.recognition.stop).toHaveBeenCalled();
  });

  test("calls addSpeech when speech is recognized", () => {
    render(
      <SpeechProvider>
        <SpeechInput />
      </SpeechProvider>
    );

    const mockEvent = {
      results: [[{ transcript: "Hello World" }]],
    };

    window.recognition.onresult(mockEvent);

    expect(mockAddSpeech).toHaveBeenCalledWith("Hello World");
  });
});
