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
)

export const Message = model("Message", messageSchema)
