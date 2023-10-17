import express from 'express'
import { userController } from '../controllers/userController.js'
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js'

export const userRouter = express.Router()

userRouter.put('/update', ctrlWrapper(userController.updateUser))
