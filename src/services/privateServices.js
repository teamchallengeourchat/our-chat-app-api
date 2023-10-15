import { PrivatesList, PrivateMessages } from "../models/userPrivate/index.js";

async function getChats(userId) {
  
	let List = await PrivatesList.find({users: { $in: userId}}).populate('users');
	
	List = List.map(({ _id, users }) => ({ id: _id.toString(), title: users.map(user => user.userName).join(", ") }));
  
  return List;
}

async function getChatHistory(chatId) {
  const messages = await PrivateMessages
    .find({ chatId })
    .populate('author');

    const preparedMessages = messages.map(({ _id, author, message, createdAt }) => ({
      id: _id.toString(),
      author: {
        id: author._id.toString(),
        name: author.userName
      },
      message,
      createdAt,
    }));

    return preparedMessages;
}

export default {
  getChats,
  getChatHistory,
};