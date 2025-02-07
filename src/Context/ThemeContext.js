import { createContext, useState, useContext } from "react";

// Create context
const ThemeContext = createContext({
  themeMode: "light",
  toggleTheme: () => {},
});

// Create provider component
export const ThemeProvider = ({ children }) => {
  const [themeMode, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
