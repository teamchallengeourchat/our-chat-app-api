const joinToChat = (chatId) => {

};

const createChat = (message, io) => {
  io.of("/private-chats")
};

const sendMessage = ({ message, room }, io) => {
  io.of("/private-chats").to(room).emit("message", { message });
};

const leaveRoom = (roomId) => {

};

export const chatsController = {
  joinToChat,
  sendMessage,
  createChat,
  leaveRoom,
};