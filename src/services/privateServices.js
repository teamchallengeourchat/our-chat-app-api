import { PrivatesList, PrivateMessages } from "../models/userPrivate/index.js"
import { ChatModel } from "../models/ChatModel.js"
import { Message } from "../models/Message.js"

/**
 *
 * @param {String} userId
 * @returns {[{ id: String, title: String }]} Prepared list of private messages
 */
async function getChats(userId) {
	let List = await PrivatesList.find({ users: { $in: userId } })
		.populate('users')
		.sort({ createdAt: -1 })

	List = List.map(({ _id, users }) => ({
		id: _id.toString(),
		title: users.map(user => user.userName).join(', '),
	}))

	return List || []
}


/**
 *
 * @param {String} chatId
 * @returns {[{ id: String, author: { id: String, name: String }, message: String, createdAt: Date }]} Prepared list of messages;
 */
async function getRooms(chatId) {
	let List = await ChatModel.find({ id: chatId }).sort({ createdAt: 1 });
  
  return List || [];
}

/**
 *
 * @param {String} chatId
 * @returns  Prepared list of messages;
 */
async function getRoomHistory(roomId) {
	const messages = await Message.find({ chatId: roomId }).populate("user").sort({ createdAt: 1 })
}

/**
 *
 * @param {String} chatId
 * @returns {[{ id: String, author: { id: String, name: String }, message: String, createdAt: Date }]} Prepared list of messages;
 */
async function getChatHistory(chatId) {
	const messages = await PrivateMessages.find({ chatId }).populate('author')

	// const preparedMessages = messages.map(({ _id, author, message, createdAt }) => ({
	// 	id: _id.toString(),
	// 	author: author,
	// 	message,
	// 	createdAt,
	// }))

	return messages
}

/**
 *
 * @param {String} chat_id
 * @param {String} user_id
 * @returns {Boolean} if successful return true
 */
async function leaveChat(chat_id, user_id) {
	try {
		const chatRoom = await PrivatesList.findById(chat_id)
		chatRoom.users = chatRoom.users.filter(id => id.toString() !== user_id)

		if (chatRoom.users.length > 0) await chatRoom.save()
		else await PrivatesList.findByIdAndDelete(chat_id)
	} catch (error) {
		throw new Error(error)
	}

	return true
}

export default {
	getRooms,
	getRoomHistory,
	getChats,
	getChatHistory,
	leaveChat,
}
