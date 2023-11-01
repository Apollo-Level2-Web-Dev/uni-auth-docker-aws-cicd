import { Server } from 'http';
import app from './app';
import config from './config';
import mongoose from 'mongoose';
import { SeedDB } from './db/seed';
import { RedisClient } from './shared/redis';
import { logger } from './shared/logger';

async function bootstrap() {
  let server: Server;

  await RedisClient.connect();

  mongoose
    .connect(config.db.url)
    .then(() => {
      logger.info('Database connected');

      SeedDB.seedSuperAdmin();

      server = app.listen(config.port, () => {
        logger.info(`Server running on port ${config.port}`);
      });
    })
    .catch((err) => {
      logger.error('Error connecting to MongoDB', err);
    });

  const exitHandler = () => {
    RedisClient.unsubscribe();
    RedisClient.disconnect();

    if (server) {
      server.close(() => {
        logger.info('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    logger.error(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();
