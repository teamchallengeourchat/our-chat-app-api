import { chatsController } from "../controllers/privateChatsController.js";

export default function(io) {
  io.of("/private-chats").on("connection", (socket) => {
    const listOfChats = getOpenedChats(userId);
    const connectionMessage = getChatHistory(chatId);
    socket.emit("connetcion", { listOfChats, message: connectionMessage });

    socket.on("join", chatsController.joinToChat)
    socket.on("create", (message) => chatsController.createChat(message, io));
    socket.on("message", (message) => chatsController.sendMessage(message, io));
    socket.on("leaveRoom", chatsController.leaveRoom);
  });
}

// socket.on("message", async ({ message, room }) => {
//   const sockets = [];
//   (await io.of("/private-chats").allSockets())
//     .forEach(item => sockets.push(item));
  
  
//   io.of("/private-chats").emit("message", {
//     message,
//     sockets
//   });
// });
