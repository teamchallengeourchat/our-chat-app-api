import { Router } from 'express';
import privatesController from '../controllers/privatesController.js';
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js';

export const privatesRouter = Router();

privatesRouter.get('/:userId', ctrlWrapper(privatesController.getChats));
