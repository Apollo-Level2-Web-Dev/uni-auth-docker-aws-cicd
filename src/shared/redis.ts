import { SetOptions, createClient } from 'redis';
import config from '../config';
import { errorLogger, logger } from './logger';

const redisClient = createClient({
  url: config.redis.url
});

redisClient.on('error', (err) => errorLogger.error('RedisError', err));
redisClient.on('connect', (err) => logger.info('Redis connected'));

const connect = async (): Promise<void> => {
  await redisClient.connect();
};

const set = async (key: string, val: string, options?: SetOptions): Promise<void> => {
  await redisClient.set(key, val, options);
};

const get = async (key: string): Promise<string | null> => {
  return await redisClient.get(key);
};

const del = async (key: string): Promise<void> => {
  await redisClient.del(key);
};

const disconnect = async (): Promise<void> => {
  await redisClient.quit();
};

const setAccessToken = async (userId: string, val: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClient.set(key, val, { EX: config.redis.accessTokenExpirationTime });
};

const getAccessToken = async (userId: string): Promise<string | null> => {
  const key = `access-token:${userId}`;
  return await redisClient.get(key);
};

const delAccessToken = async (userId: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await redisClient.del(key);
};

export const RedisClient = {
  connect,
  set,
  get,
  del,
  disconnect,
  setAccessToken,
  getAccessToken,
  delAccessToken,
  publish: redisClient.publish.bind(redisClient),
  subscribe: redisClient.subscribe.bind(redisClient),
  unsubscribe: redisClient.unsubscribe.bind(redisClient)
};
