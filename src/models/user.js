import { Schema, model } from 'mongoose'

const schema = new Schema(
	{
		userName: {
			type: String,
			default: '',
		},
		userMood: {
			type: String,
			enum: ['1', '2', '3', '4', '5'],
		},
	},
	{ versionKey: false, timestamps: true },
)

export const User = model('users', schema)
