import { Types } from 'mongoose'
import { ApiError } from '../exceptions/ApiError.js'
import { User } from '../models/user.js'
import PrivatesList from '../models/userPrivate/privatesList.js'
import { Message } from '../models/Message.js'
import privateServices from '../services/privateServices.js'

const ObjectId = Types.ObjectId

async function signup(req, res) {
	const { userName, userMood } = req.body
	// TODO: Find a way to single of truth valid mood values there and in model
	const validMood = [1, 2, 3, 4, 5]

	if (Object.keys(req.body).length === 0) throw ApiError.BadRequest('Empty body of request.')

	if (userName.trim().length < 2 || userName.trim().length >= 20)
		throw ApiError.NotValidData('The name must have at least 2 characters and 20 less.')

	if (!userMood || !validMood.includes(userMood)) throw ApiError.NotValidData('No Mood selected')

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

	console.log(userId);

	const user = await User.findById(userId)

	const chatList = (await PrivatesList.find({ users: { $in: ObjectId(userId) } })).map(chat =>
		chat._id.toString(),
	)

	// console.log(chatList);
	chatList.forEach(chatId => {
		privateServices.leaveChat(chatId, userId)
	})	

	await Message.updateMany({
		user: ObjectId(userId),
	}, {
		userName: user.userName
	})

	await User.findByIdAndDelete(userId)

	return res.status(200).json({
		code: 200,
		status: 'OK',
	})
}

export const authController = { signup, signin, signout }
