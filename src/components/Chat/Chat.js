import react, { useState, useRef, useEffect } from "react";
import { LuSend } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdChatBubbleOutline } from "react-icons/md";
import SyncLoader from "react-spinners/SyncLoader";
import Settings from "../Settings/Settings";
import { ToastContainer, toast } from "react-toastify";
import { useToggle } from "../../Hooks/useToggle";
import { useTheme } from "../../Context/ThemeContext";
import { CiMicrophoneOn } from "react-icons/ci";
import { useSpeech } from "../../Context/SpeechContext";
import SpeechInput from "../ChatContainer/SpeechInput";

export default function Chat() {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const controllerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, openCloseModal] = useToggle(false);
  const { themeMode, toggleTheme } = useTheme();
  const { speechToText, setSpeechToText, isSpeechEable } = useSpeech();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!speechToText && !input) {
      return;
    }

    setInput(speechToText);
    setIsLoading(true);
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const userMessage = { role: "user", content: speechToText || input };
    setData((prev) => [
      ...prev,
      {
        ...userMessage,
        timestamp,
        ...(speechToText ? { source: "speech" } : { source: "text" }),
      },
    ]);
    setInput("");
    setSpeechToText("");

    try {
      controllerRef.current = new AbortController();
      const response = await fetch(
        "https://mock-epic-chat-interface-api.onrender.com/api/messages",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: [
              ...data.map((el) => ({ role: el.role, content: el.content })),
              userMessage,
            ],
            source: "text",
          }),
          signal: controllerRef.current.signal,
        }
      )
        .then((res) => res.json())
        .then((el) =>
          setData((prev) => [...prev, { ...el, role: "assistant" }])
        )
        .catch((error) => {
          throw new Error("Request failed");
        });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error:", error);
        toast("Failed to fetch response!");
      }
    } finally {
      setIsLoading(false);
      controllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setData([
      {
        role: "assistant",
        content: "Hello! How can I assist you today!",
        timestamp,
      },
    ]);
  }, []);

  return (
    <div className="container">
      <ToastContainer />
      <div
        style={{
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button style={{ borderRadius: "50%", padding: "10px 12px" }}>
            <MdChatBubbleOutline size="1.25rem" />
          </button>

          <div>
            <b>Aryan's AI Chat Assistant </b>
            <br></br>
            {isSpeechEable
              ? "Speech recognition enabled"
              : "Speech recognition disabled"}
          </div>
        </div>

        <div style={{ cursor: "pointer" }} onClick={openCloseModal}>
          <IoSettingsOutline size="1.25rem" />
        </div>
      </div>
      <div className="chat-container">
        {data.map((msg, index) => (
          <div
            style={
              msg.role === "user"
                ? {
                    display: "flex",
                    justifyContent: "flex-end",
                  }
                : {
                    display: "flex",
                    justifyContent: "flex-start",
                  }
            }
            key={index}
            className={`message ${msg.role}`}
          >
            <div
              style={
                msg.role === "user"
                  ? {
                      background: "#0070f3",
                      color: "white",
                    }
                  : {
                      background: "#ffffff",
                      boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
                    }
              }
              className="content"
            >
              {msg?.source === "speech" && (
                <span style={{ fontSize: "12px", color: "#adcbfb" }}>
                  <CiMicrophoneOn /> Voice message
                </span>
              )}
              <br></br>
              {msg?.content}
              <br></br>
              <div
                style={{
                  textAlign: "left",
                  fontSize: "14px",
                  paddingTop: "5px",

                  ...(msg.role === "user"
                    ? {
                        color: "#adcbfb",
                      }
                    : {
                        color: "#a5aab1",
                      }),
                }}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        <SyncLoader
          color={"#0070f3"}
          loading={isLoading}
          cssOverride={{
            display: "block",
            margin: "auto",
            paddingLeft: "5px",
          }}
          size={10}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
      <div className="input-box">
        <form onSubmit={handleSubmit} className="input-area">
          <input
            type="text"
            value={speechToText ? speechToText + "..." : input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          {isSpeechEable && (
            <span>
              <SpeechInput />
            </span>
          )}
          <button
            style={{ display: "flex" }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : <LuSend size="1.25rem" />}
          </button>
          {isLoading && (
            <button type="button" onClick={stopGeneration}>
              Stop
            </button>
          )}
        </form>
      </div>
      <style jsx>{`
        .container {
          margin: 0 auto;
        }
        .content {
          padding: 10px;
          border-radius: 5px;
        }
        .chat-container {
          height: 80vh;
          background-color: #f9fafb;
          position: relative;
          overflow-y: auto;
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 20px;
        }
        .message {
          padding: 5px;
        }
        .role {
          font-weight: bold;
          margin-bottom: 5px;
          color: #666;
        }
        .input-box {
          display: flex;
          z-index: 9;
          background-color: #ffffff;
          flex-direction: column;
          justify-content: flex-end;
          position: sticky;
          bottom: 0;
          padding: 10px;
          margin: auto;
          width: 98vw;
        }

        .input-area {
          display: flex;
          gap: 10px;
        }
        input {
          flex: 1;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
      {themeMode === "dark" && (
        <style jsx>{`
          button {
            background-color: black;
          }
          .chat-container {
            background-color: black;
          }
        `}</style>
      )}
      <Settings modalIsOpen={modalIsOpen} closeModal={openCloseModal} />
    </div>
  );
}
