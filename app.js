const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const app = express();

// set Static folder
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = socketIO(server);

// run when client connects
io.on("connection", socket => {
  //   console.log("New WS in action");
  // emit to the user on new Connection
  socket.emit("message", "Welcome to Chat-It!");

  //   broad cast to all user on a new user join
  socket.broadcast.emit("message", "A new User has Joined!");

  //   broadcast to all user when someone disconnects
  socket.on("disconnect", () => {
    io.emit("message", "A user has Left the chat");
  });

  //   getting message from client side
  socket.on("chatMessage", msg => {
    // console.log(msg);
    io.emit("message", msg);
  });
});

server.listen(3000, () => {
  console.log("server listing to port 3000");
});
