import privatesSocketController from '../controllers/privateSocketController.js'

export default function (io) {
	io.of('/private-chat').on('connection', socket => {
		privatesSocketController.connection(socket)

		socket.on('message', data => privatesSocketController.sendMessage(socket, data))
	})
}
