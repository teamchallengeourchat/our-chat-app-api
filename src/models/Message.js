import { Schema, model } from 'mongoose'

export const Message = model(
		'Message',
		new Schema(
			{
				text: {
					type: String,
					required: true,
				},
				user: {
					type: Schema.Types.ObjectId,
					ref: 'users',
					required: true,
				},
				chatId: {
					type: String,
					required: true,
				},
				userName: {
					type: String,
					default: ''
				}
			},
			{ versionKey: false, timestamps: true }
		).index({ createdAt: 1 }, { expireAfterSeconds: 2 * 24 * 60 * 60 })
	)
