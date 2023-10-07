import mongoose from 'mongoose';

export const dbConnect = () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.MONGODB_HOST_URI, () => console.log('Connected to DB'));
};