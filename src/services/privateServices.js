import { PrivatesList, PrivateMessages } from '../models/userPrivate/index.js'

/**
 *
 * @param {String} userId
 * @returns {[{ id: String, title: String }]} Prepared list of private messages
 */
async function getChats(userId) {
	const chatList = await PrivatesList.find({ users: { $in: userId } })
		.populate('users')
		.sort({ createdAt: -1 })

	const preparedChatList = chatList.map(({ _id, title }) => ({
		id: _id.toString(),
		title,
	}))

	return preparedChatList ?? []
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
 * @param {String} chatId
 * @param {String} userId
 * @returns {Boolean} if successful return true
 */
async function leaveChat(chatId, userId) {
	try {
		const chatRoom = await PrivatesList.findById(chatId)
		chatRoom.users = chatRoom.users.filter(id => id.toString() !== userId)

		if (chatRoom.users.length > 0) {
			await chatRoom.save()
		} else {
			await PrivatesList.findByIdAndDelete(chatId)
		}
		return true
	} catch (error) {
		return false
		throw new Error(error)
	}
}

export default {
	getChats,
	getChatHistory,
	leaveChat,
}
