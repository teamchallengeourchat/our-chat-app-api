import { Types } from 'mongoose'
import privateServices from '../services/privateServices.js'
import { User } from '../models/user.js'
import { PrivatesList, PrivateMessages } from '../models/userPrivate/index.js'
// import { ApiError } from '../exceptions/ApiError.js'

const ObjectId = Types.ObjectId

const errorCodes = {
	unauthorized: 0,
	deletedChat: 1,
	invalidChatId: 2,
}

const connection = async socket => {
	const { userId, chatId = ObjectId().toString(), chat_title = '' } = socket.handshake?.query

	const hex = /^(?:[0-9A-Fa-f]{24}|[0-9]{1,19}|[A-Fa-f0-9]{24})$/
	if (!hex.test(chatId)) {
		socket.emit('error', errorCodes.invalidChatId)
		return
	}

	const [chatRoom, user] = await Promise.all([
		PrivatesList.findById(chatId).populate('users'),
		User.findById(userId),
	])

	if (!user) {
		socket.emit('error', errorCodes.unauthorized)
		return
	}

	if (!chatRoom) {
		socket.emit('error', errorCodes.deletedChat)
		return
	}

	const isUserInRoom = chatRoom.users.some(user => user._id.equals(userId))
	if (!isUserInRoom) {
		chatRoom.users.push(userId)
		chatRoom.save()
	}

	await socket.join(chatId)

	const populateTitle =
		chatRoom.users.length === 1
			? 'Новий чат (зараз тут тільки ти)'
			: chatRoom.users
					.filter(({ _id }) => _id.toString() !== userId)
					.map(({ userName }) => userName)
					.join(', ')

	socket.emit('history', {
		chat: { id: chatRoom._id, title: populateTitle },
		messages: await privateServices.getChatHistory(chatId),
	})

	socket.to(chatId).emit('user-connected', { title: user.userName })
}

const sendMessage = async (socket, { message, room, userId }) => {
	const newMessage = await PrivateMessages.create({ chatId: room, author: userId, message })
	const populatedMessage = await newMessage.populate('author')

	socket.emit('message', populatedMessage)
	socket.to(room).emit('message', populatedMessage)
}

const startWrite = async (socket, { chatId, userName }) => {
	socket.to(chatId).emit('user-start-write', { userName })
}

const endWrite = async (socket, { chatId, userName }) => {
	socket.to(chatId).emit('user-end-write', { userName })
}

export { connection, sendMessage, startWrite, endWrite }
