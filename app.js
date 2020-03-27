const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");
const formatMessage = require("./util/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./util/users");
const app = express();

// set Static folder
app.use(express.static(path.join(__dirname, "public")));

const server = http.createServer(app);
const io = socketIO(server);
const botName = "Chat-It bot";
// run when client connects
io.on("connection", socket => {
  //   console.log("New WS in action");
  // emit to the user on new Connection

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    socket.emit(
      "message",
      formatMessage(botName, `Welcome to Chat-It!-->${user.username}`)
    );

    //   broad cast to all user on a new user join
    socket.broadcast
      .to(user.room)
      .emit("message", formatMessage(botName, `${user.username} has Joined!`));

    // sends users and rooms info
    io.to(user.room).emit("roomUsers", {
      users: getRoomUsers(user.room),
      room: room
    });
  });

  //   getting message from client side
  socket.on("chatMessage", msg => {
    // console.log("into chat message:-" + msg);
    // console.log(socket.id);

    const user = getCurrentUser(socket.id);
    // console.log(user);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //   broadcast to all user when someone disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has Left the chat`)
      );
      io.to(user.room).emit("roomUsers", {
        users: getRoomUsers(user.room),
        room: user.room
      });
    }
  });
});

server.listen(3000, () => {
  console.log("server listing to port 3000");
});
