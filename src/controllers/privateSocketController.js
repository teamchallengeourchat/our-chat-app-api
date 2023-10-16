import { Types } from "mongoose"
import { ApiError } from "./../exceptions/ApiError.js"
import privateServices from "../services/privateServices.js"
import { User } from "../models/user.js"
import { PrivatesList, PrivateMessages } from "../models/userPrivate/index.js"

const ObjectId = Types.ObjectId

const connection = async socket => {
	const { user_id, chat_id = ObjectId().toString(), chat_title = "" } = socket.handshake?.query

	const user = await User.findById(user_id)

	if (!user) ApiError.Unauthorized()

	let chatRoom = await PrivatesList.findById(chat_id)

	if (!chatRoom) {
		chatRoom = await new PrivatesList({ _id: ObjectId(chat_id), users: user_id, title: chat_title }).save()
	}

	if (!chatRoom?.users?.includes(user_id)) {
		chatRoom?.users?.push(user_id)
		await chatRoom?.save()
	}

	await socket.join(chat_id)

	socket.emit("history", {
		chat_id,
		messages: await privateServices.getChatHistory(chat_id),
		chats: await privateServices.getChats(user_id),
	})
	socket.to(chat_id).emit("user-connected", { title: user.userName })
}

const sendMessage = async (socket, { message, room, userId }) => {
	const newMessage = await PrivateMessages.create({ chatId: room, author: userId, message })
	const populatedMessage = await newMessage.populate("author")

	socket.emit("message", populatedMessage)
	socket.to(room).emit("message", populatedMessage)
}

const leaveChat = async (socket, { chat_id, user_id }) => {
	const user = await User.findById(user_id)

	if (!user) ApiError.Unauthorized()

	const result = privateServices.leaveChat(chat_id, user_id)

	if (!result) throw new ApiError.BadRequest("Can`t leave chat")

	socket.emit("leave-chat", { status: "OK" })
	socket.to(room).emit("leave-chat", { title: user.userName })
}

export default {
	connection,
	sendMessage,
	leaveChat,
}
