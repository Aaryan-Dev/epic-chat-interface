import { render, screen, fireEvent } from "@testing-library/react";
import Settings from "../components/Settings/Settings";
import { ThemeProvider } from "../../Context/ThemeContext";
import { SpeechProvider } from "../../Context/SpeechContext";
import Modal from "react-modal";

jest.mock("../../Context/ThemeContext", () => ({
  useTheme: jest.fn(() => ({
    themeMode: "light",
    toggleTheme: jest.fn(),
  })),
}));

jest.mock("../../Context/SpeechContext", () => ({
  useSpeech: jest.fn(() => ({
    isSpeechEable: false,
    toggleSpeech: jest.fn(),
  })),
}));

describe("Settings Component", () => {
  beforeAll(() => {
    Modal.setAppElement(document.createElement("div")); // Prevents accessibility warnings in tests
  });

  test("renders Settings modal", () => {
    render(
      <ThemeProvider>
        <SpeechProvider>
          <Settings modalIsOpen={true} closeModal={jest.fn()} />
        </SpeechProvider>
      </ThemeProvider>
    );

    expect(screen.getByText(/Settings/i)).toBeInTheDocument();
    expect(screen.getByText(/Dark theme/i)).toBeInTheDocument();
    expect(screen.getByText(/Speech recognition/i)).toBeInTheDocument();
    expect(screen.getByText(/Language/i)).toBeInTheDocument();
  });

  test("toggles theme switch", () => {
    const toggleThemeMock = jest.fn();
    require("../../Context/ThemeContext").useTheme.mockReturnValue({
      themeMode: "light",
      toggleTheme: toggleThemeMock,
    });

    render(
      <ThemeProvider>
        <SpeechProvider>
          <Settings modalIsOpen={true} closeModal={jest.fn()} />
        </SpeechProvider>
      </ThemeProvider>
    );

    const themeSwitch = screen.getByRole("checkbox", { name: /dark theme/i });
    fireEvent.click(themeSwitch);
    expect(toggleThemeMock).toHaveBeenCalled();
  });

  test("toggles speech recognition switch", () => {
    const toggleSpeechMock = jest.fn();
    require("../../Context/SpeechContext").useSpeech.mockReturnValue({
      isSpeechEable: false,
      toggleSpeech: toggleSpeechMock,
    });

    render(
      <ThemeProvider>
        <SpeechProvider>
          <Settings modalIsOpen={true} closeModal={jest.fn()} />
        </SpeechProvider>
      </ThemeProvider>
    );

    const speechSwitch = screen.getByRole("checkbox", {
      name: /speech recognition/i,
    });
    fireEvent.click(speechSwitch);
    expect(toggleSpeechMock).toHaveBeenCalled();
  });

  test("closes modal on request", () => {
    const closeModalMock = jest.fn();

    render(
      <ThemeProvider>
        <SpeechProvider>
          <Settings modalIsOpen={true} closeModal={closeModalMock} />
        </SpeechProvider>
      </ThemeProvider>
    );

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(closeModalMock).toHaveBeenCalled();
  });
});
