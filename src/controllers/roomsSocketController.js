import { Types } from "mongoose";
import { ApiError } from "../exceptions/ApiError.js"
import { ChatModel } from "../models/ChatModel.js"
import { Message } from "../models/Message.js"
import { User } from "../models/user.js"

const { ObjectId } = Types;

const connection = async socket => {
	const { user_id, chat_id = ObjectId().toString() } = socket.handshake?.query

	const user = await User.findById(user_id)

	if (!user) ApiError.Unauthorized()

	let chatRoom = await ChatModel.findOne({ id: chat_id })

	if (!chatRoom) ApiError.BadRequest('Chat not found');

	if (!chatRoom.members.includes(user_id)) {
		chatRoom.members.push(user_id)
		await chatRoom.save()
	}

	await socket.join(chat_id)

	socket.emit("history", {
		messages: await privateServices.getChatHistory(chat_id),
	})
	socket.to(chat_id).emit("user-connected", { title: user.userName })
}

const sendMessage = async (socket, { message, room }, userId) => {
	const newMessage = await Message.create({ chatId: room, author: userId, message })
	const populatedMessage = await newMessage.populate("author")

	socket.emit("message", populatedMessage)
	socket.to(room).emit("message", populatedMessage)
}

export default {
	connection,
	sendMessage,
}