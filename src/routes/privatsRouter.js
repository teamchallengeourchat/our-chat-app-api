import { Router } from 'express';

export const privatsRouter = Router();

privatsRouter.get('/', (req, res) => {
  res.send('Privates');
})
