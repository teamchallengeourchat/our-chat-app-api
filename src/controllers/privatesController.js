import { ApiError } from '../exceptions/ApiError.js';
import { User } from '../models/user.js';
import privateServices from '../services/privateServices.js';

const getChats = async (req, res) => {
  const { userId } = req.params;
  const user = await User.find({ _id: userId});

	if (!user) ApiError.Unauthorized();

	const list = privateServices.getChats(userId);

	try {
		res.status(200).json(list);
	} catch (error) {
		res.status(500).json(error);
	}
}

export default { getChats };
