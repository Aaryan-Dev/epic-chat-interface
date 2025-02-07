import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../Context/ThemeContext";

describe("ThemeContext", () => {
  test("default theme mode should be light", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    expect(result.current.themeMode).toBe("light");
  });

  test("toggleTheme should switch themeMode between light and dark", () => {
    const { result } = renderHook(() => useTheme(), { wrapper: ThemeProvider });

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.themeMode).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.themeMode).toBe("light");
  });

  test("useTheme throws an error if used outside ThemeProvider", () => {
    const { result } = renderHook(() => {
      try {
        return useTheme();
      } catch (error) {
        return error;
      }
    });

    expect(result.current).toBeInstanceOf(Error);
    expect(result.current.message).toBe(
      "useTheme must be used within a ThemeProvider"
    );
  });
});
