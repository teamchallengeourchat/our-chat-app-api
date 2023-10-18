import { Types } from 'mongoose'
import { ApiError } from '../exceptions/ApiError.js'
import { ChatModel } from '../models/ChatModel.js'
import { Message } from '../models/Message.js'
import { User } from '../models/user.js'
import privateServices from '../services/privateServices.js'

const connection = async socket => {
	const { userId, roomId } = socket.handshake?.query

	if (
		roomId !== 'news' &&
		roomId !== 'general' &&
		roomId !== 'dating' &&
		roomId !== 'business' &&
		roomId !== 'work'
	) {
		socket.emit('error', 'Invalid room ID')
	}

	const [chatRoom, user] = await Promise.all([
		ChatModel.findOne({ id: roomId }),
		User.findById(userId),
	])

	if (!chatRoom || !user) {
		socket.emit('error')
		return
	}

	await socket.join(roomId)

	socket.emit('history', {
		messages: await privateServices.getRoomHistory(roomId),
	})
	socket.to(roomId).emit('user-connected', { title: user.userName })
}

const sendMessage = async (socket, { text, senderId, chatId }) => {
	const newMessage = await Message.create({ chatId, user: senderId, text })
	const populatedMessage = await newMessage.populate('user')

	socket.emit('message', populatedMessage)
	socket.to(chatId).emit('message', populatedMessage)
}

export default {
	connection,
	sendMessage,
}
