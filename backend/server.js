const express = require("express");
const mongoose = require("mongoose");
const Message = require("./models/messages");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

mongoose
  .connect(
    "mongodb+srv://1234:1234@cluster0.eegpygg.mongodb.net/letschatdb?retryWrites=true"
  )
  .then(() => {
    console.log("Connected to DB");

    app.get("/api/health", (req, res) => {
      res.json({ message: "Server Ok", status: "200" });
    });

    app.post("/api/login", (req, res) => {
      try {
        const { name, password } = req.body;
        if (name && password === "mobius") {
          res.json({ message: "welcome" });
        } else {
          res.status(401).json({ message: "imposter" });
        }
      } catch (error) {
        res.status(400).json(error.message);
      }
    });

    app.get("/api/messages", async (req, res) => {
      const messages = await Message.find().sort({ timestamp: 1 });
      res.json(messages);
    });

    app.delete("/api/messages", async (req, res) => {
      await Message.deleteMany({});
      res.json({ message: "All messages deleted" });
    });

    app.get("*", (req, res) => {
      res.status(404).json("Not found");
    });

    io.on("connection", (socket) => {
      socket.on("join", (username) => {
        console.log(`${username} has joined`);
        socket.broadcast.emit("someone_joined", username);
      });
      socket.on("leave", (username) => {
        console.log(`${username} has left`);
        socket.broadcast.emit("someone_left", username);
      });
      socket.on("client_msg", async (msg) => {
        await Message.create({ sender: msg.sender, content: msg.content });
        socket.broadcast.emit("server_msg", msg);
      });
    });

    server.listen(4000, () => {
      console.log("Socket server listening on port 4000...");
    });
  });
