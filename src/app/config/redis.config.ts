import { createClient } from 'redis';
import { envVariables } from './env';

export const redisClient = createClient({
    username: envVariables.REDIS.REDIS_USERNAME,
    password: envVariables.REDIS.REDIS_PASSWORD,
    socket: {
        host: envVariables.REDIS.REDIS_HOST,
        port: Number(envVariables.REDIS.REDIS_PORT),
        connectTimeout: 3000,
        reconnectStrategy: (retries) => {
            if (retries > 2) {
                return false; // Stop retrying after 2 attempts
            }
            return 1000;
        }
    }
});

redisClient.on('error', (err: any) => {
    console.warn('⚠️ Redis Client Warning:', err?.message || err);
});

export const connectRedis = async () => {
    try {
        if (!redisClient.isOpen) {
            await Promise.race([
                redisClient.connect(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Redis connection timed out after 3s')), 3000)
                )
            ]);
            console.log('✅ Redis connected successfully');
        }
    } catch (error: any) {
        console.warn('⚠️ Could not connect to Redis:', error?.message || error);
    }
};

