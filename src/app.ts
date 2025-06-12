import express from 'express';
import { configModule } from './common/config/config.module';
import mainRouter from './common/routes/index.route';
import Database from './database/Database';
// import { errorLogger, requestLogger } from './middleware/logger.middleware';
import { errorLogger, requestLogger } from '@/common/middlewares/logger.middleware';
const app = express();
const port = configModule.getNumber('PORT');

async function bootstrap() {
  const db = Database.getInstance();
  await db.connect(configModule.get('DB_CONNECTION_STRING'));

  app.use(requestLogger);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', mainRouter);
  app.use(errorLogger);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

bootstrap();
