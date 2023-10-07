import { ApiError } from '../exceptions/ApiError.js';
import { User } from '../models/user.js';

async function signup(req, res) {
	const { userName, userMood } = req.body;
	// TODO: Find a way to single of truth valid mood values there and in model
	const validMood = [1, 2, 3, 4, 5];

	// if (Object.keys(req.body).length === 0) throw ApiError.BadRequest("Empty body of request.");

	// if (userName.trim().length <= 1) throw ApiError.NotValidData("The name must have at least 2 characters.");

	// if (!userMood || validMood.includes(userMood)) throw ApiError.NotValidData("No Mood selected");

	const newUser = await User.create({
		userName,
		userMood,
	})

	return res.status(201).json({
		code: 201,
		newUser,
	})
}

export const authController = { signup };