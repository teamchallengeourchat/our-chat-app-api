import { ChatModel } from '../models/ChatModel.js'
import { Rooms } from '../models/rooms.js'

const GetRooms = async (req, res) => {
	let rooms = await Rooms.find().exec()

	rooms = rooms.map(({ id, title, image, description }) => ({ id, title, image, description }))

	try {
		res.status(200).json(rooms)
	} catch (error) {
		res.status(500).json(error)
	}
}
const GetRoomById = async (req, res) => {
	const { id } = req.params

	if (!id) {
		console.error('chat_id is not defined')
		return
	}

	try {
		const chatRoom = await ChatModel.findOne({ id })
		res.status(200).json(chatRoom)
	} catch (error) {
		res.status(500).json(error)
	}
}

export const roomsController = { GetRooms, GetRoomById }
