const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

app.get("/api/health", (req, res) => {
  res.json({ message: "Server Ok", status: "200" });
});

app.post("/api/login", (req, res) => {
  try {
    const { name, password } = req.body;
    if (name && password === "rvboys") {
      res.json({ message: "welcome" });
    } else {
      res.status(401).json({ message: "imposter" });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

app.get("*", (rea, res) => {
  res.status(404).json("Not found");
});

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("client_msg", (msg) => {
    socket.broadcast.emit("server_msg", msg);
  });
});

server.listen(4000, () => {
  console.log("Socket server listening on port 4000...");
});
