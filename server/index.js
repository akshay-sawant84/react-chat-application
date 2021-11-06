const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data.room);

    socket.emit("receive_message", {
      message: `${data.user}, welcome to room ${data.room}.`,
    });
    socket.broadcast
      .to(data.room)
      .emit("receive_message", { message: `${data.user} has joined!` });
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});

server.listen(process.env.PORT || 5000, () =>
  console.log(`Server has started.`)
);
