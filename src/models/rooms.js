import { Schema, model, Types } from 'mongoose'

export default {
	Rooms: model('rooms', Schema(
		{
			_id: {
				type: Number,
				required: true,
			},
			id: {
				type: String,
				default: '',
				required: true,
			},
			title: {
				type: String,
				default: '',
				required: true,
			},
			image: {
				name: {
					type: String,
					default: '',
				},
				alt: {
					type: String,
					default: '',
				},
			},
			description: {
				type: String,
				default: '',
			},
		},
		{ versionKey: false, timestamps: false },
	)),
}
