export default async function (io) {
	io.of("/rooms").on("connection", socket => {
		privatesSocketController.connection(socket)

		socket.on("message", data => privatesSocketController.sendMessage(socket, data))
	})
}
