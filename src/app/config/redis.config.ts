import { createClient } from 'redis';
import { envVariables } from './env';

const redisClient = createClient({
    username: envVariables.REDIS.REDIS_USERNAME,
    password: envVariables.REDIS.REDIS_PASSWORD,
    socket: {
        host: envVariables.REDIS.REDIS_HOST,
        port: Number(envVariables.REDIS.REDIS_PORT)
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

// await redisClient.connect();
// await redisClient.set('foo', 'bar');
// const result = await redisClient.get('foo');
// console.log(result)  // >>> bar

export const connectRedis = async () => {
    if(!redisClient.isOpen){
        await redisClient.connect();
        console.log('Redis connected successfully');
    }
}