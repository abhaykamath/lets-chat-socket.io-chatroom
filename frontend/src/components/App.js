import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesListRef = useRef(null);

  function scrollToBottom() {
    messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
  }

  useEffect(() => {
    socket.on("server_msg", (msg) => {
      setMessages((messages) => [
        ...messages,
        { content: msg, user: "server" },
      ]);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <h1>
        Let's Talk <img src="./favicon.png"></img> - A chatroom made with
        socket.io
      </h1>
      <div className="chat-container">
        <form
          id="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (newMessage !== "") {
              setMessages((messages) => [
                ...messages,
                { content: newMessage, user: "client" },
              ]);
              socket.emit("client_msg", newMessage);
              setNewMessage("");
            }
          }}
        >
          <div className="messages-container" ref={messagesListRef}>
            {messages.map((msg, index) => {
              return (
                <div
                  key={index}
                  className="message"
                  style={{
                    justifyContent:
                      msg.user === "client" ? "flex-end " : "flex-start",
                  }}
                >
                  <span
                    style={{
                      backgroundColor:
                        msg.user === "client" ? "#25d366" : "#fff",
                      borderBottomRightRadius:
                        msg.user === "client" ? "0" : "0.75rem",
                      borderBottomLeftRadius:
                        msg.user === "server" ? "0" : "0.75rem",
                    }}
                  >
                    {msg.content}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="input-group">
            <input
              className="form-control"
              placeholder="Type your message here"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
              }}
            ></input>
            <button type="submit" className="btn btn-success">
              send <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
