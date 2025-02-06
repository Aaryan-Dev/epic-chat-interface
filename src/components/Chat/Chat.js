import { useState, useRef } from "react";

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      controllerRef.current = new AbortController();
      const response = await fetch("http://localhost:3001/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: [...messages, userMessage],
          source: "text",
        }),
        signal: controllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Request failed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantMessage;
          return newMessages;
        });
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Error: Failed to fetch response",
          },
        ]);
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

  return (
    <div className="container">
      <div className="chat-container">
        {messages.map((msg, index) => (
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
                      background: "#f0f0f0",
                    }
                  : {
                      background: "#e3f2fd",
                    }
              }
              className="content"
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
        {isLoading && (
          <button type="button" onClick={stopGeneration}>
            Stop
          </button>
        )}
      </form>

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
          overflow-y: auto;
          border: 1px solid #ccc;
          padding: 10px;
          margin-bottom: 20px;
          border-radius: 8px;
        }
        .message {
          padding: 5px;
        }
        .role {
          font-weight: bold;
          margin-bottom: 5px;
          color: #666;
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
          border-radius: 4px;
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
