import { Schema, model } from 'mongoose'
import { MOOD_VARIANTS } from '../data/constants.js'

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
				enum: MOOD_VARIANTS,
			},
		},
		{ versionKey: false, timestamps: true },
	))
