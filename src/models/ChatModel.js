import { Schema, model } from "mongoose"

const ChatSchema = new Schema({
	id: {
		type: String,
		required: true,
		unique: true,
	},
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: "Message",
			default: [],
		},
	],
	members: [
		{
			type: Schema.Types.ObjectId,
			ref: "users",
		},
	],
}).index({ createdAt: -1 })

export const ChatModel = model("Chat", ChatSchema)
