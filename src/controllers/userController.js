import { User } from '../models/user.js';

async function updateUser(req, res) {
  const { userId } = req.query;
	const { userName, userMood } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, {
      userName,
      userMood,
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({
        code: 404,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      code: 200,
      updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Произошла ошибка при обновлении пользователя',
      error: error.message,
    });
  }
}

export const userController = { updateUser };