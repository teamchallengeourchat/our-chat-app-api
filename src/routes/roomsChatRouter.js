import roomsSocketController from '../controllers/roomsSocketController.js'

export default async function (io) {
	io.of('/rooms').on('connection', socket => {
		roomsSocketController.connection(socket)

		socket.on('message', data => roomsSocketController.sendMessage(socket, data))
	})
}
