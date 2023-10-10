import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    UserIds: {
      type: Array,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
      default: true,
    }
  },
  { versionKey: false, timestamps: true }
);

export const userPrivateMessagesModel = mongoose.model("privateMessages", schema);