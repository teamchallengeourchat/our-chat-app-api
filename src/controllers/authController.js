import { ApiError } from '../exceptions/ApiError.js';
import { User } from '../models/user.js';

async function signup(req, res) {
  const { userName, userMood } = req.body;
  // TODO: Find a way to single of truth valid mood values there and in model
  const validMood = [1, 2, 3, 4, 5];

  if (Object.keys(req.body).length === 0) throw ApiError.BadRequest("Empty body of request.");

  if (userName.trim().length < 2 && userName.trim().length >= 20) throw ApiError.NotValidData("The name must have at least 2 characters and 20 less.");

  if (!userMood || !validMood.includes(userMood)) throw ApiError.NotValidData("No Mood selected");

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

async function signout(req, res) {}

export const authController = { signup, signin, signout };