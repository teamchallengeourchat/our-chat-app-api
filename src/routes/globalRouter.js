import express from 'express';
import { ctrlWrapper } from "../middlewares/ctrlWrapper.js";

export const globalRouter = express.Router();

globalRouter.get("/", ctrlWrapper((req, res, next) => {
  res.send('DEMO CHAT API');
}));