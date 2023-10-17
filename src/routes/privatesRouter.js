import { Router } from 'express'
import privatesController from '../controllers/privatesController.js'
import { ctrlWrapper } from '../middlewares/ctrlWrapper.js'

export const privatesRouter = Router()

privatesRouter.get('/:user_id', ctrlWrapper(privatesController.getChats))
privatesRouter.post('/add/', ctrlWrapper(privatesController.createChat))
privatesRouter.post('/leave/', ctrlWrapper(privatesController.leaveChat))
