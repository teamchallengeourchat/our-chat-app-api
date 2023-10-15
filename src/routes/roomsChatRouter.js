// import { Rooms } from '../models/rooms.js'
import { ChatModel } from "../models/ChatModel.js"
import { Message } from "../models/Message.js"
import { User } from "../models/user.js"

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

// Предварительный код для сравнения, работает - проверял )
// let rooms = await Rooms.find().exec();

//   rooms = rooms
//       .map(({ id, title, image, description }) => (
//         { id, title, image, description }
//       ));

//   for (const room of rooms) {
//     io.of(`/${room.id}`).on("connection", (socket) => {
//       socket.on("message", async (message) => {
//         const sockets = [];
//         (await io.of(`/${room.id}`).allSockets()).forEach(item => sockets.push(item));
//         io.of(`/${room.id}`).emit("message", {
//           message,
//           iosockets:sockets
//         })
//       })
//     });
//   }

// Для получения учасников чата обратись к io.of(`/${room.id}`).allSockets()
// он возвращает промис с типом Set который может быть удобно проитерировать например:
// orderNamespace.on("connection", (socket) => {
//   socket.on("create", (message) => {
//     io.of("/private-chats")
//   });
//   socket.join("room1");
//   socket.on("message", async (message) => {
//     const sockets = [];
//     (await orderNamespace.allSockets()).forEach(item => sockets.push(item));
//     orderNamespace.to("room1").emit("message", {
//       message,
//       iosockets:sockets
//     })
//   })
// });
