import { Types } from 'mongoose'
// import { ApiError } from '../exceptions/ApiError.js'
import { ChatModel } from '../models/ChatModel.js'
import { Message } from '../models/Message.js'
import { User } from '../models/user.js'
import privateServices from '../services/privateServices.js'

const errorCodes = {
	unauthorized: 0,
	deletedRoom: 1,
	invalidRoomId: 2
}

const connection = async socket => {
	const { userId, roomId } = socket.handshake?.query

	if (['news', 'general', 'dating', 'business', 'work'].includes(roomId)) {
		socket.emit('error', errorCodes.invalidRoomId)
	}

	const [chatRoom, user] = await Promise.all([
		ChatModel.findOne({ id: roomId }),
		User.findById(userId),
	])

	if (!chatRoom || !user) {
		socket.emit('error', errorCodes.unauthorized)
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

const startWrite = async (socket, { chatId, userName }) => {
	socket.to(chatId).emit('user-start-write', { userName })
}

const endWrite = async (socket, { chatId, userName }) => {
	socket.to(chatId).emit('user-end-write', { userName })
}

export {
	connection,
	sendMessage,
	startWrite,
	endWrite,
}
