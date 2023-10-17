import { Schema, model } from "mongoose"

const messageSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
		},
		user: {
			type: Schema.Types.ObjectId,
			ref: "users",
			required: true,
		},
		chatId: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
).index({ createdAt: 1 }, { expireAfterSeconds: 2 * 24 * 60 * 60 })

export const Message = model("Message", messageSchema)
