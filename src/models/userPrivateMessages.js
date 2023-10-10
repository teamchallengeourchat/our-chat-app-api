import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    ChatId: {
      type: string,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    messageText: {
      type: String,
      required: true,
    }
  },
  { versionKey: false, timestamps: true }
);

export const userPrivateMessagesModel = mongoose.model("privateMessages", schema);