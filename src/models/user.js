import { Schema, model } from 'mongoose'

export const User = model(
		'users',
		new Schema(
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
	))
