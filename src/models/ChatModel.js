import { Schema, model } from 'mongoose'

export const ChatModel = model(
	'Chat',
	new Schema({
		id: {
			type: String,
			required: true,
			unique: true,
		},
		messages: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Message',
				default: [],
			},
		],
	}).index({ createdAt: -1 })
)
