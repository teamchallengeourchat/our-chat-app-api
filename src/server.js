import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Server } from 'socket.io'
import http from 'http'
import ChatModel from './models/ChatModel.js'
import { rooms } from './data/rooms.js'
import { dbConnect } from './services/dbConnect.js'

// routes
import { globalRouter, authRouter, roomsRouter, privatsRouter, userRouter } from './routes/index.js'

dotenv.config()
const app = express()
// ... (використання middleware)

// Load environment variables
const PORT = process.env.SERVER_PORT || 8080

const startupDevMode = app.get('env') === 'development'
const formatsLogger = startupDevMode ? 'dev' : 'short'
const clientURL = startupDevMode ? process.env.TEST_URL : process.env.CLIENT_URL

dbConnect()

// Set up the express application
app.use(bodyParser.json({ limit: '30mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.use(
	cors({
		origin: ['https://our-chat-app-two.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],
		credentials: true,
		optionsSuccessStatus: 200,
	})
)

app.use(express.static('public'))
app.use('/images', express.static('images'))

// routes
app.use('/', globalRouter)
app.use('/auth', authRouter)
app.use('/rooms', roomsRouter)
app.use('/private', privatsRouter)
app.use('/user', userRouter)

const httpServer = http.createServer(app)
const io = new Server(httpServer, {
	cors: {
		origin: ['https://our-chat-app-two.vercel.app', 'http://localhost:3000', 'http://localhost:3001'],
		optionsSuccessStatus: 200,
	},
})

let activeUsers = []
let addedUserInCurrentChat = []
const username = 'lesoRoman'

io.on('connection', socket => {
	console.log('New User Connected', socket.id)
	socket.on('new-user-add', async user_id => {
		// if user is not added previously
		console.log(!activeUsers.some(user => user.userId === user_id))
		if (!activeUsers.some(user => user.userId === user_id)) {
			activeUsers.push({ userId: user_id, socketId: socket.id })
			console.log('New User Connected', activeUsers)
		}

		io.emit('get-users', activeUsers)
	})
	socket.on('add-user-in-curent-chatRoom', ({ userName }) => {
		console.log('get-curent-chatRoom', userName)
		io.emit('user-added-in-chatRoom', userName)
	})
	socket.on('get-curent-chatRoom', async chat_id => {
		console.log('get-curent-chatRoom', chat_id)

		if (chat_id === 'undefined' && chat_id === 'null') {
			console.error('chat_id is not defined')
			return
		}

		try {
			let newChatRoom = null
			const chatRoom = await ChatModel.findById(chat_id)
			newChatRoom = chatRoom
			io.emit('get-chatRoom', newChatRoom)
		} catch (error) {
			console.error("Error while processing 'get-curent-chatRoom':", error)
		}
	})
	socket.on('send-message', async ({ text, senderId, chatId, userName, userMood }) => {
		try {
			const chatRoom = await ChatModel.findById(chatId)

			if (chatRoom) {
				chatRoom.messages.push({ text, senderId, chatId, userName, userMood, createdAt: Date.now() })
				await chatRoom.save()
			}
		} catch (error) {
			console.error("Error while processing 'get-curent-chatRoom':", error)
		}

		// socket.emit('receive-message', data)
		// socket.broadcast.emit('receive-message', data);
		// socket.emit('receive-message', data);

		const upDatedChat = await ChatModel.findById(chatId)
		activeUsers.forEach(element => {
			console.log('--------------', upDatedChat.messages[upDatedChat.messages.length - 1])
			io.to(element.socketId).emit('receive-message', upDatedChat.messages[upDatedChat.messages.length - 1])
		})
	})
	socket.on('disconnect', () => {
		activeUsers = activeUsers.filter(user => user.socketId !== socket.id)
		console.log('User Disconnected', activeUsers)
		io.emit('get-users', activeUsers)
	})
})

httpServer.listen(PORT, () => console.log(`Listening at Port ${PORT}`))
