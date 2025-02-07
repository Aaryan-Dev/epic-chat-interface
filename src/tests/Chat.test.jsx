import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Chat from "../components/Chat/Chat";
import { ThemeProvider } from "../../Context/ThemeContext";
import { SpeechProvider } from "../../Context/SpeechContext";
import { useToggle } from "../../Hooks/useToggle";

jest.mock("../../Hooks/useToggle", () => ({
  useToggle: jest.fn(),
}));

jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container"></div>,
  toast: jest.fn(),
}));

describe("Chat Component", () => {
  beforeEach(() => {
    useToggle.mockReturnValue([false, jest.fn()]);
  });

  test("renders chat component", () => {
    render(
      <ThemeProvider>
        <SpeechProvider>
          <Chat />
        </SpeechProvider>
      </ThemeProvider>
    );

    expect(screen.getByText(/Aryan's AI Chat Assistant/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Type your message/i)
    ).toBeInTheDocument();
  });

  test("disables input when loading", async () => {
    render(
      <ThemeProvider>
        <SpeechProvider>
          <Chat />
        </SpeechProvider>
      </ThemeProvider>
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() => expect(input).toBeDisabled());
  });

  test("sends a message and displays response", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({ content: "Hi there!", role: "assistant" }),
      })
    );

    render(
      <ThemeProvider>
        <SpeechProvider>
          <Chat />
        </SpeechProvider>
      </ThemeProvider>
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText("Hello")).toBeInTheDocument();
      expect(screen.getByText("Hi there!")).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test("displays toast notification on fetch error", async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error("Request failed")));

    render(
      <ThemeProvider>
        <SpeechProvider>
          <Chat />
        </SpeechProvider>
      </ThemeProvider>
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    await waitFor(() =>
      expect(screen.getByTestId("toast-container")).toBeInTheDocument()
    );

    global.fetch.mockRestore();
  });

  test("renders loader while fetching", async () => {
    global.fetch = jest.fn(() => new Promise(() => {})); // Mock pending request

    render(
      <ThemeProvider>
        <SpeechProvider>
          <Chat />
        </SpeechProvider>
      </ThemeProvider>
    );

    const input = screen.getByPlaceholderText(/Type your message/i);
    const sendButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(sendButton);

    expect(screen.getByTestId("loader")).toBeInTheDocument();

    global.fetch.mockRestore();
  });
});
