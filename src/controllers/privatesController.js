import { ApiError } from '../exceptions/ApiError.js'
import { User } from '../models/user.js'
import privateServices from '../services/privateServices.js'
import { io } from '../server.js'
import { Types } from 'mongoose'

const ObjectId = Types.ObjectId

const getChats = async (req, res) => {
	const { userId } = req.params
	const user = await User.findById(userId)

	if (!user) ApiError.Unauthorized()

	const list = await privateServices.getChats(userId)

	try {
		res.status(200).json(list)
	} catch (error) {
		res.status(500).json(error)
	}
}

const createChat = async (req, res) => {
	const { userId: user_id } = req.params
	const user = await User.findById(user_id)

	if (!user) ApiError.Unauthorized()

	const chatRoom = await new PrivatesList({
		_id: ObjectId(chat_id),
		users: [ObjectId(user_id)],
		title: chat_title,
	}).save()

	try {
		res.status(200).json({ chat_id: chatRoom._id.toString() })
	} catch (error) {
		res.status(500).json(error)
	}
}

const leaveChat = async () => {
	const { user_id } = req.params
	const { chat_id } = req.body

	const user = await User.findById(user_id)

	if (!user) ApiError.Unauthorized()

	const result = privateServices.leaveChat(chat_id, user_id)

	if (!result) throw new ApiError.BadRequest('Can`t leave chat')

	io.of('/private-chat').join(chat_id)

	io.of('/private-chat').to(chat_id).emit('leave-chat', { title: user.userName })

	io.of('/private-chat').leave(chat_id)

	try {
		res.status(200).json({ status: 200, text: 'OK' })
	} catch (error) {
		res.status(500).json(error)
	}
}

export default { getChats, createChat, leaveChat }
