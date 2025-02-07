import react, { useState, useRef, useEffect } from "react";
import { LuSend } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { MdChatBubbleOutline } from "react-icons/md";
import SyncLoader from "react-spinners/SyncLoader";
import { ToastContainer, toast } from "react-toastify";

export default function Chat() {
  const [input, setInput] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const userMessage = { role: "user", content: input };
    setData((prev) => [...prev, { ...userMessage, timestamp }]);
    setInput("");

    try {
      controllerRef.current = new AbortController();
      const response = await fetch("http://localhost:3001/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: [userMessage],
          source: "text",
        }),
        signal: controllerRef.current.signal,
      })
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

  console.log("isLoading", isLoading);

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
            <br></br> Speech recognition enabled
          </div>
        </div>

        <div>
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
              {msg.content}
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
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading}>
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
          height: 70vh;
          z-index: 9;
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
          // z-index: -1;
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
          border-radius: 5px;
          cursor: pointer;
        }
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
