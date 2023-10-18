import { Types } from 'mongoose'
import privateServices from '../services/privateServices.js'
import { User } from '../models/user.js'
import { PrivatesList, PrivateMessages } from '../models/userPrivate/index.js'
import { ApiError } from '../exceptions/ApiError.js'

const ObjectId = Types.ObjectId

const connection = async socket => {
	const { userId, chatId = ObjectId().toString(), chat_title = '' } = socket.handshake?.query

	try {
		const hex = /^(?:[0-9A-Fa-f]{24}|[0-9]{1,19}|[A-Fa-f0-9]{24})$/
		if (!hex.test(chatId)) {
			socket.emit('error', 'Invalid chatId')
			return
		}

		const [chatRoom, user] = await Promise.all([
			PrivatesList.findById(chatId),
			User.findById(userId),
		])

		if (!user) {
			ApiError.Unauthorized()
			return
		} else if (!chatRoom) {
			socket.emit('deleted-chat')
			return
		}

		if (!chatRoom.users.includes(userId)) {
			chatRoom.users.push(userId)
			await chatRoom.save()
		}

		await socket.join(chatId)

		const chatList = await chatRoom.populate('users')
		chatRoom.title =
			chatRoom.users.length === 1
				? 'Новий чат (зараз тут тільки ти)'
				: chatList.users
						.filter(({ _id }) => _id.toString() !== userId)
						.map(({ userName }) => userName)
						.join(', ')
		await chatRoom.save()

		socket.emit('history', {
			chat: chatRoom,
			messages: await privateServices.getChatHistory(chatId),
		})
		socket.to(chatId).emit('user-connected', { title: user.userName })
	} catch (err) {
		console.log(err)
	}
}

const sendMessage = async (socket, { message, room, userId }) => {
	const newMessage = await PrivateMessages.create({ chatId: room, author: userId, message })
	const populatedMessage = await newMessage.populate('author')

	socket.emit('message', populatedMessage)
	socket.to(room).emit('message', populatedMessage)
}

export default {
	connection,
	sendMessage,
}
