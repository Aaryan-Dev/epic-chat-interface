import { renderHook, act } from "@testing-library/react";
import { useToggle } from "../Hooks/useToggle";

describe("useToggle Hook", () => {
  test("should initialize with false by default", () => {
    const { result } = renderHook(() => useToggle());

    expect(result.current[0]).toBe(false);
  });

  test("should initialize with true when passed as initial state", () => {
    const { result } = renderHook(() => useToggle(true));

    expect(result.current[0]).toBe(true);
  });

  test("should toggle state when toggle function is called", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current[1](); // Toggle once
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1](); // Toggle again
    });
    expect(result.current[0]).toBe(false);
  });
});
