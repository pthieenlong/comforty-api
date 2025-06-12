import express, { Response, Request, response, request, NextFunction } from 'express';

const commentRoute = express.Router();

//api/user/
commentRoute.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
      text: "Hello world"
    })
})


export default commentRoute;
