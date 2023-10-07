import mongoose from 'mongoose';

const schema = mongoose.Schema(
  {
    userName: {
      type: String,
      default: "",
    },
    userMood: {
      type: String,
      enum: ["1", "2","3","4","5"]
    },
  },
  { versionKey: false, timestamps: true }
);

export const User = mongoose.model("users", schema);