import { rooms } from '../data/rooms.js'
import ChatModel from '../models/ChatModel.js'

const GetRooms = async (req, res) => {
	try {
		res.status(200).json(rooms)
	} catch (error) {
		res.status(500).json(error)
	}
}
const GetRoomById = async (req, res) => {
	const { id } = req.params
	console.log('id',id)
	if (id === 'undefined' && id === 'null') {
		console.error('chat_id is not defined')
		return
	}

	try {
		let newChatRoom = null
		const chatRoom = await ChatModel.findById(id)
		newChatRoom = chatRoom
		res.status(200).json(newChatRoom)
	} catch (error) {
		res.status(500).json(error)
	}
}

export const roomsController = { GetRooms, GetRoomById };