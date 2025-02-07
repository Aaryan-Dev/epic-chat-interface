import { createContext, useState, useContext } from "react";

// Create context
const SpeechContext = createContext({
  speechToText: "",
  addSpeech: () => {},
});

// Create provider component
export const SpeechProvider = ({ children }) => {
  const [speechToText, setSpeechToText] = useState("");
  const [isSpeechEable, setIsSpeechEable] = useState(true);

  const addSpeech = (text) => {
    setSpeechToText(text);
  };

  const toggleSpeech = () => {
    setIsSpeechEable((prevMode) => !prevMode);
  };

  return (
    <SpeechContext.Provider
      value={{
        speechToText,
        addSpeech,
        setSpeechToText,
        isSpeechEable,
        toggleSpeech,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

// Custom hook to use Speech context
export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error("useSpeech must be used");
  }
  return context;
};
