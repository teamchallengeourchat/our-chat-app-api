import { Schema, model } from 'mongoose';

export default model(
  'privates_lists',
  new Schema({
      title: {
        type: String,
        default: "",
      },
      users: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: 'users'
          }
        ],
        required: true,
        default: [],
      }
    }, {
      versionKey: false,
      timestamps: true
    }
  ).index({ createdAt: -1 })
);