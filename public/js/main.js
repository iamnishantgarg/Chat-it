const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

const socket = io();

// get username and room
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});
console.log(username + " " + room);

socket.emit("joinRoom", { username, room });

socket.on("message", message => {
  //   console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// message Sbmit
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  //   getting message text
  const msg = e.target.elements.msg.value;

  // emmiting mesage to server

  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
  //   console.log(msg);
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
            <p class="text">
              ${message.text}
            </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}
