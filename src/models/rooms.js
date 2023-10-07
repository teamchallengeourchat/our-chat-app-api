import mongoose from 'mongoose';

// name, isDefault, id, ?description,s

const roomsSchema = mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      default: "",
      required: true,
    },
    title: {
      type: String,
      default: "",
      required: true,
    },
    image: {
      name: {
        type: String,
        default: "",
      },
      alt: {
        type: String,
        default: "",
      }
    },
    description: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: false, }
);

export const Rooms = mongoose.model("rooms", roomsSchema);