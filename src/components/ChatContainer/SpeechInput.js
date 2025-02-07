import { useState, useEffect } from "react";
import { CiMicrophoneOn } from "react-icons/ci";
import { CiMicrophoneOff } from "react-icons/ci";
import { useSpeech } from "../../Context/SpeechContext";

const SpeechInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [savedTexts, setSavedTexts] = useState([]);
  const { addSpeech } = useSpeech();

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setText(transcript);
      addSpeech(transcript);
    };

    recognition.onerror = (event) => {
      setStatus("Error occurred in recognition: " + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      setStatus("Listening stopped");
    };

    window.recognition = recognition;

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const startListening = () => {
    if (isListening !== true) {
      window.recognition.start();
      setIsListening(true);
      setStatus("Listening...");
    } else {
      window.recognition.stop();
      setIsListening(false);
      setStatus("Stopped...");
    }
  };

  const saveText = () => {
    if (text.trim()) {
      setSavedTexts((prev) => [...prev, text]);
      setText("");
    }
  };

  return (
    <div className="speech-container">
      <button
        type="button"
        style={isListening ? { backgroundColor: "grey" } : {}}
        onClick={startListening}
      >
        {!isListening && <CiMicrophoneOn size="1.25rem" />}
        {isListening && (
          <CiMicrophoneOff backgroundColor="white" size="1.25rem" />
        )}
      </button>
    </div>
  );
};

export default SpeechInput;
