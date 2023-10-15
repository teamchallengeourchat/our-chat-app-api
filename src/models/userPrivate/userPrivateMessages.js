import { Schema, model } from 'mongoose';

export default model(
  'privates_messages',
  new Schema({
      chatId: {
        type: Schema.Types.ObjectId,
        ref: 'privates_lists',
        required: true,
      },
      author: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      message: {
        type: Schema.Types.String,
        required: true,
        default: '',
      }
    }, {
      versionKey: false,
      timestamps: true
    }
  ).index({ createdAt: 1 }, { expireAfterSeconds: 2 * 24 * 60 * 60 }) // Удаление сообщений старше 2х дней.
);