import privatesSocketController from "../controllers/privateSocketController.js";

export default function(io) {
  io.of("/private-chat").on("connection", (socket) => {
    // on connection get history, send alert with connected userName, or create and join to new chat room
    privatesSocketController.connection(socket);

    //
    socket.on("leave-chat", (data) => privatesSocketController.leaveChat(socket, data));

    // 
    socket.on("message", (data) => privatesSocketController.sendMessage(socket, data));

    //
    // socket.on("disconnect", privatesSocketController.disconectFromChat); // for info usability to new messages when you is out
  });
}
