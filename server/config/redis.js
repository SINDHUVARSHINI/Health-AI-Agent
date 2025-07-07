const redis = require('redis');
const { logger } = require('../utils/logger');

let redisClient = null;

const redisConfig = {
  development: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    retry_strategy: (options) => {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        logger.error('Redis server refused connection');
        throw new Error('Redis server refused connection');
      }
      if (options.total_retry_time > 1000 * 60 * 60) {
        logger.error('Redis retry time exhausted');
        throw new Error('Redis retry time exhausted');
      }
      if (options.attempt > 10) {
        logger.error('Redis max retry attempts reached');
        throw new Error('Redis max retry attempts reached');
      }
      return Math.min(options.attempt * 100, 3000);
    }
  },
  production: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
    retry_strategy: (options) => {
      if (options.total_retry_time > 1000 * 60 * 60) {
        throw new Error('Redis retry time exhausted');
      }
      return Math.min(options.attempt * 100, 3000);
    }
  }
};

async function initializeRedis() {
  try {
    const environment = process.env.NODE_ENV || 'development';
    const config = redisConfig[environment];
    
    redisClient = redis.createClient(config);
    
    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });
    
    redisClient.on('ready', () => {
      logger.info('Redis client ready');
    });
    
    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err);
    });
    
    redisClient.on('end', () => {
      logger.info('Redis client disconnected');
    });
    
    await redisClient.connect();
    
    return redisClient;
  } catch (error) {
    logger.error('Redis initialization failed:', error);
    throw error;
  }
}

async function getRedisClient() {
  if (!redisClient) {
    await initializeRedis();
  }
  return redisClient;
}

async function closeRedis() {
  if (redisClient) {
    try {
      await redisClient.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }
  }
}

// Cache utility functions
async function setCache(key, value, ttl = 3600) {
  try {
    const client = await getRedisClient();
    await client.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error('Error setting cache:', error);
  }
}

async function getCache(key) {
  try {
    const client = await getRedisClient();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Error getting cache:', error);
    return null;
  }
}

async function deleteCache(key) {
  try {
    const client = await getRedisClient();
    await client.del(key);
  } catch (error) {
    logger.error('Error deleting cache:', error);
  }
}

async function clearCache() {
  try {
    const client = await getRedisClient();
    await client.flushAll();
    logger.info('Cache cleared');
  } catch (error) {
    logger.error('Error clearing cache:', error);
  }
}

module.exports = {
  initializeRedis,
  getRedisClient,
  closeRedis,
  setCache,
  getCache,
  deleteCache,
  clearCache
}; 