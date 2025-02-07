import React from "react";
import Chat from "./components/Chat/Chat.js";
import { ThemeProvider } from "./Context/ThemeContext";

const App = () => {
  return (
    <div>
      <ThemeProvider>
        <Chat />
      </ThemeProvider>
    </div>
  );
};

export default App;
