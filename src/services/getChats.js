import { PrivatesList } from '../models/userPrivate/index.js'

/**
 *
 * @param {String} userId
 * @returns {[{ id: String, title: String }]} Prepared list of private messages
 */

async function getChats(userId) {
	const chatList = await PrivatesList.find({ users: { $in: userId } })
		.populate('users')
		.sort({ createdAt: -1 })

	const preparedChatList = chatList.map(({ _id, users }) => ({
		id: _id.toString(),
		title:
			users.length !== 1 ? users.map(user => user.userName).join(', ') : 'Тут поки нікого немає...',
	}))

	return preparedChatList ?? []
}
