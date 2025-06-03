import express, { Response, Request, response, request, NextFunction } from 'express';

const authRoute = express.Router();

//api/user/
authRoute.use('/', (req: Request, res: Response, next: NextFunction) => {
    res.json({
      text: "Hello world"
    })
})


export default authRoute;
