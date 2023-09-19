import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";

import "../styles/ChatContainer.css";

// const socket = io("https://letschat-backend-yqwa.onrender.com");

function ChatContainer({ socket, username }) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesListRef = useRef(null);

  function scrollToBottom() {
    messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
  }

  function someoneJoined(joined_username) {
    setMessages((messages) => [
      ...messages,
      {
        joined: true,
        username: joined_username,
      },
    ]);
  }
  function someoneLeft(left_username) {
    setMessages((messages) => [
      ...messages,
      {
        left: true,
        username: left_username,
      },
    ]);
  }

  function sendNewMessage() {
    const payload = {
      content: newMessage,
      sender: username,
      user: "client",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((messages) => [...messages, payload]);
    socket.emit("client_msg", payload);
    setNewMessage("");
  }

  async function loadMessagesFromDB() {
    setLoading(true);
    // const response = await fetch("http://localhost:4000/api/messages");
    const response = await fetch(
      "https://mychatapp-atvt.onrender.com/api/messages"
    );
    const messages_from_db = await response.json();
    setMessages(
      messages_from_db.map((msg) => {
        return {
          content: msg.content,
          sender: msg.sender,
          user: msg.sender === username ? "client" : "server",
          timestamp: new Date(msg.timestamp).toLocaleString(),
        };
      })
    );
    setLoading(false);
  }

  useEffect(() => {
    loadMessagesFromDB();
    socket.on("someone_joined", (joined_username) => {
      someoneJoined(joined_username);
    });
    socket.on("someone_left", (left_username) => {
      someoneLeft(left_username);
    });
    socket.on("server_msg", (msg) => {
      setMessages((messages) => [
        ...messages,
        {
          content: msg.content,
          sender: msg.sender,
          user: msg.sender === username ? "client" : "server",
          timestamp: msg.timestamp,
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
            sendNewMessage();
          }
        }}
      >
        <div className="messages-container" ref={messagesListRef}>
          {loading && (
            <div className="loader-container">
              <Loader />
            </div>
          )}
          {messages.map((msg, index) => {
            if (msg.left) {
              return (
                <div key={index} className="joined-message">
                  <span>{msg.username} has left the chat</span>
                </div>
              );
            } else if (msg.joined) {
              return (
                <div key={index} className="joined-message">
                  <span>{msg.username} has joined the chat</span>
                </div>
              );
            } else {
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
            }
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
