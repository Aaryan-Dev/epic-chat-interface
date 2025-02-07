import React from "react";
import Chat from "./components/Chat/Chat.js";
import { ThemeProvider } from "./Context/ThemeContext";
import { SpeechProvider } from "./Context/SpeechContext";

const App = () => {
  return (
    <div>
      <ThemeProvider>
      <SpeechProvider>
        <Chat />
      </SpeechProvider>
      </ThemeProvider>
    </div>
  );
};

export default App;
