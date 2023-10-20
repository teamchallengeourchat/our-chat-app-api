import { PrivatesList, PrivateMessages } from '../models/userPrivate/index.js'
import { ChatModel } from '../models/ChatModel.js'
import { Message } from '../models/Message.js'
import { Types } from 'mongoose'
import { User } from '../models/user.js'

const { ObjectId } = Types

/**
 *
 * @param {String} userId
 * @returns {[{ id: String, title: String }]} Prepared list of private messages
 */
async function getChats(userId) {
	const chatList = await PrivatesList.find({ users: { $in: userId } })
		.populate('users')
		.sort({ createdAt: -1 })

	return chatList.map(({ _id, users }) => ({
		id: _id.toString(),
		title: users
				.filter(user => user._id.toString() !== userId)
				.map(user => user.userName)
				.join(', ') || 'Новий чат (зараз тут тільки ти)',
	}))  ?? []
}

/**
 *
 * @param {String} chatId
 * @returns {[{ id: String, author: { id: String, name: String }, message: String, createdAt: Date }]} Prepared list of messages;
 */
async function getChatHistory(chatId) {
	let privateHistory = await PrivateMessages.find({ chatId }).populate('author') || []

	console.log(privateHistory);

	privateHistory = privateHistory.map(({ _id, message, author, chatId, createdAt, authorName }) => {
		const newUser = {
			_id: author?._id,
			userName: author?.userName ?? authorName,
			userMood: author?.userMood
		};

		return { _id, message, chatId, createdAt, author: newUser }
	})

	return privateHistory
}

/**
 *
 * @param {String} chatId
 * @param {String} userId
 * @returns {Boolean} if successful return true
 */
async function leaveChat(chatId, userId) {
	try {
		const privateChatRoom = await PrivatesList.findById(chatId).populate('users')

		privateChatRoom.users = privateChatRoom.users.filter(({ _id }) => _id.toString() !== userId)

		if (privateChatRoom.users.length === 0) {
			await PrivatesList.findByIdAndDelete(chatId)
			return true
		}

		const user = await User.findById(userId)

		PrivateMessages.updateMany(
			{ chatId: privateChatRoom._id, author: ObjectId(userId) },
			{ authorName: user.userName },
		)

		privateChatRoom.save()

		return true
	} catch (error) {
		return false
	}
}

/**
 *
 * @param {String} chatId
 * @returns {[{ id: String, author: { id: String, name: String }, message: String, createdAt: Date }]} Prepared list of messages;
 */
async function getRooms(chatId) {
	let List = await ChatModel.find({ id: chatId }).sort({ createdAt: 1 })

	return List || []
}

/**
 *
 * @param {String} chatId
 * @returns  Prepared list of messages;
 */
async function getRoomHistory(roomId) {
	//TODO: Сделать подмена юзера на объект с именем юзера когда юзер разлогинился
	return await Message.find({ chatId: roomId }).populate('user').sort({ createdAt: 1 })
}

export default {
	getRooms,
	getRoomHistory,
	getChats,
	getChatHistory,
	leaveChat,
}
