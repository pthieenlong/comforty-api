import express, { Request, Response } from 'express';
import { configModule } from './config/config.module';
const app = express();
const port = configModule.getNumber('PORT');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello Express + TypeScript!');
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
