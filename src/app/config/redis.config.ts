import { createClient } from 'redis';
import { envVariables } from './env';

export const redisClient = createClient({
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



// import { createClient } from 'redis';

// const client = createClient({
//     username: 'default',
//     password: '3MjNreDmP5AE4iuzPT2MRwuvmwGTVDzH',
//     socket: {
//         host: 'redis-11808.c91.us-east-1-3.ec2.cloud.redislabs.com',
//         port: 11808
//     }
// });

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar

