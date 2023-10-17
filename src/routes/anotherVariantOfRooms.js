export default async function (io) {
  let activeUsers = []

	io.on("connection", socket => {
		socket.on("new-user-add", async user_id => {
			if (!activeUsers.some(user => user.userId === user_id)) {
				activeUsers.push({ userId: user_id, socketId: socket.id })
			}

			io.emit("get-users", activeUsers)
		})
		socket.on("add-user-in-curent-chatRoom", ({ userName }) => {
			io.emit("user-added-in-chatRoom", userName)
		})
		socket.on("get-curent-chatRoom", async (chat_id, userId) => {
			try {
				const chatRoom = await ChatModel.findOne({ id: chat_id })

				if (!chatRoom) {
					const user = await User.findById(userId)

					const newChatRoom = new ChatModel({
						id: chat_id,
						members: [user],
						messages: [],
					})
					await newChatRoom.save()
					io.emit("get-chatRoom", newChatRoom)
				} else {
					const populatedChatRoom = await chatRoom.populate({
						path: "messages",
						populate: {
							path: "user",
						},
					})
					console.log("populatedChatRoom", populatedChatRoom)

					io.emit("get-chatRoom", populatedChatRoom)
				}
			} catch (error) {
				console.error("Error while processing 'get-curent-chatRoom':", error)
			}
		})
		socket.on("send-message", async ({ text, senderId, chatId }) => {
			try {
				const chatRoom = await ChatModel.findOne({ id: chatId })

				const user = await User.findById(senderId)
				const newMessage = new Message({ text, user, chatId })
				await newMessage.save()

				if (chatRoom.messages) {
					chatRoom.messages.push(newMessage)
					await chatRoom.save()
				} else {
					chatRoom.messages = [newMessage]
					await chatRoom.save()
				}

				const upDatedChat = await chatRoom.populate({
					path: "messages",
					populate: {
						path: "user",
						model: "users",
					},
				})
				console.log("upDatedChat", upDatedChat)

				socket.emit("receive-message", upDatedChat.messages.at(-1));
				activeUsers.forEach(element => {
					io.to(element.socketId).emit("receive-message", upDatedChat.messages.at(-1))
				})
			} catch (error) {
				console.error("Error while processing 'get-curent-chatRoom':", error)
			}
		})
		socket.on("disconnect", () => {
			activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
			console.log("User Disconnected", activeUsers)
			io.emit("get-users", activeUsers)
		})
	})
}