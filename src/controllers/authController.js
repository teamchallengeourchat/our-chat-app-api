import { Types } from 'mongoose'
import { ApiError } from '../exceptions/ApiError.js'
import { User } from '../models/user.js'
import { PrivatesList, PrivateMessages } from '../models/userPrivate/index.js'
import { Message } from '../models/Message.js'
import privateServices from '../services/privateServices.js'
import { MOOD_VARIANTS } from '../data/constants.js'

const ObjectId = Types.ObjectId

async function signup(req, res) {
	const { userName, userMood } = req.body

	if (Object.keys(req.body).length === 0) throw ApiError.BadRequest('Empty body of request.')

	if (userName.trim().length < 2 || userName.trim().length >= 20)
		throw ApiError.NotValidData('The name must have at least 2 characters and 20 less.')

	if (!userMood || !MOOD_VARIANTS.includes(userMood)) throw ApiError.NotValidData('No Mood selected')

	const newUser = await User.create({
		userName,
		userMood,
	})

	return res.status(201).json({
		code: 201,
		newUser,
	})
}

async function signin(req, res) {}

async function signout(req, res) {
	const { userId } = req.params

	const user = await User.findById(userId)
	if (!user) return

	// private lists and messages
	const privateChatList = (
		await PrivatesList
			.find({ users: { $in: ObjectId(userId) } })
	).map(chat => chat._id.toString())

		console.log("signout-chatlist", privateChatList);

		privateChatList.forEach(async (chatId) => {
			await privateServices.leaveChat(chatId, userId)
		})

		// NOT DELETE "AWAIT" not work without it
		await PrivateMessages.updateMany({ author: ObjectId(userId) }, { authorName: user.userName })

		// global rooms messages add name of signout user when user _id is undefined
		// NOT DELETE "AWAIT" not work without it
	await Message.updateMany({ user: ObjectId(userId) }, { userName: user.userName })

		// NOT DELETE "AWAIT" not work without it
	await User.findByIdAndDelete(userId)

	return res.status(200).json({
		code: 200,
		status: 'OK',
	})
}

export const authController = { signup, signin, signout }
