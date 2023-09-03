import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import "../styles/ChatContainer.css";

// const socket = io("http://localhost:4000");
const socket = io("https://letschat-backend-yqwa.onrender.com");

function ChatContainer({ username }) {
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
        {
          content: msg.newMessage,
          sender: msg.sender,
          user: "server",
          timestamp: new Date().toLocaleString(),
        },
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
    <div className="chat-container">
      <form
        id="chat-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (newMessage !== "") {
            setMessages((messages) => [
              ...messages,
              {
                content: newMessage,
                sender: username,
                user: "client",
                timestamp: new Date().toLocaleString(),
              },
            ]);
            socket.emit("client_msg", { sender: username, newMessage });
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
                <span className={msg.user}>
                  <div className="text-danger sender">
                    ~ {msg.sender === username ? "you" : msg.sender}
                  </div>
                  <div>{msg.content}</div>
                  <div className="timestamp">{msg.timestamp}</div>
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
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatContainer;
