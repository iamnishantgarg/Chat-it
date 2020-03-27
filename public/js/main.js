const chatForm = document.getElementById("chat-form");
const socket = io();

socket.on("message", message => {
  console.log(message);
  outputMessage(message);
});

// message Sbmit
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  //   getting message text
  const msg = e.target.elements.msg.value;

  // emmiting mesage to server

  socket.emit("chatMessage", msg);
  console.log(msg);
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">Brad <span>9:12pm</span></p>
            <p class="text">
              ${message}
            </p>`;

  document.querySelector(".chat-messages").appendChild(div);
}
