import { Router, Request, Response, NextFunction } from 'express';

const route = Router();

//! Solve Container.get(logger) issue
export default (app: Router) => {
  app.use('/user', route);

  route.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      return res.status(201).json({"Server Working": true});
    } catch (e) {
      return next(e);
    }
  });
};
