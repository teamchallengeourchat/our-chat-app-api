import { Types } from 'mongoose'
import privateServices from '../services/privateServices.js'
import { User } from '../models/user.js'
import { PrivatesList, PrivateMessages } from '../models/userPrivate/index.js'
// import { ApiError } from '../exceptions/ApiError.js'

const ObjectId = Types.ObjectId

const errorCodes = {
	unauthorized: 0,
	deletedChat: 1,
	invalidChatId: 2
}

const connection = async socket => {
	const { userId, chatId = ObjectId().toString(), chat_title = '' } = socket.handshake?.query

	const hex = /^(?:[0-9A-Fa-f]{24}|[0-9]{1,19}|[A-Fa-f0-9]{24})$/
	if (!hex.test(chatId)) {
		socket.emit('error', errorCodes.invalidChatId)
		return
	}

	const [chatRoom, user] = await Promise.all([
		PrivatesList.findById(chatId),
		User.findById(userId),
	])

	if (!user) {
		socket.emit('error', errorCodes.unauthorized)
		return;
	};

	if (!chatRoom) {
		socket.emit('error', errorCodes.deletedChat)
		return;
	}

	if (!chatRoom.users.includes(userId)) {
		chatRoom.users.push(userId)
		await chatRoom.save()
	}

	await socket.join(chatId)

	let populateTitle = chatRoom.users.length === 1
		? 'Новий чат (зараз тут тільки ти)'
		: chatList.users
				.filter(({ _id }) => _id.toString() !== userId)
				.map(({ userName }) => userName)
				.join(', ');

	socket.emit('history', {
		chat: { ...chatRoom, title: populateTitle },
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

const startWrite = async (socket, { room, userName }) => {
	socket.to(room).emit('user-start-write', { userName })
}

const endWrite = async (socket, { room, userName }) => {
	socket.to(room).emit('user-end-write', { userName })
}

export {
	connection,
	sendMessage,
	startWrite,
	endWrite,
}
