import { connection, sendMessage, startWrite, endWrite } from '../controllers/privateSocketController.js'

export default function (io) {
	io.of('/private-chat').on('connection', socket => {
		connection(socket)

		socket.on('message', data => sendMessage(socket, data))

		socket.on('user-start-write', data => startWrite(socket, data)) // { room, userName } == data

		socket.on('user-end-write', data => endWrite(socket, data)) // { room, userName } == data
	})
}
