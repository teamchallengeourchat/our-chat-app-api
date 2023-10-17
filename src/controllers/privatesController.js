import { ApiError } from '../exceptions/ApiError.js'
import { User } from '../models/user.js'
import privateServices from '../services/privateServices.js'
import { Types } from 'mongoose'
import PrivatesList from '../models/userPrivate/privatesList.js'

const ObjectId = Types.ObjectId

const getChats = async (req, res) => {
	const { user_id: userId } = req.params
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
	const { userId } = req.body
	const user = await User.findById(userId)

	if (!user) ApiError.Unauthorized()

	const chatRoom = await new PrivatesList({
		users: [user],
		title: 'Новий чат (зараз тут тільки ти)',
	}).save()

	try {
		res.status(200).json({ id: chatRoom._id, title: chatRoom.title })
	} catch (error) {
		res.status(500).json(error)
	}
}

const leaveChat = async (req, res) => {
	const { userId, chatId } = req.body

	const user = await User.findById(userId)

	if (!user) ApiError.Unauthorized()

	const result = await privateServices.leaveChat(chatId, userId)

	if (!result) throw new ApiError.BadRequest('Can`t leave chat')

	try {
		if (result) res.status(200).json({ status: 200, chats })
	} catch (error) {
		res.status(500).json(error)
	}
}

export default { getChats, createChat, leaveChat }
