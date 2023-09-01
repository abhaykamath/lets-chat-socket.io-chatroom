const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("user connected");
  socket.on("client_msg", (msg) => {
    console.log(msg);
    socket.broadcast.emit("server_msg", msg);
  });
});

server.listen(4000, () => {
  console.log("Socket server listening on port 4000...");
});
