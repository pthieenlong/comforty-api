import express, { Request, Response } from 'express';
import { configModule } from './config/config.module';
import mainRouter from './routes/index.route';

const app = express();
const port = configModule.getNumber('PORT');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', mainRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
