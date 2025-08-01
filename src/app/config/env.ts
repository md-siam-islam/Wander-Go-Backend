import { string } from 'zod';
import dotenv from "dotenv";
dotenv.config();


interface envarInterface {
    PORT: string,
    DB_URL: string,
    NODE_ENV: string,
    JWT_SECRET: string,
    JWT_REFRESH_SECRET :string,
    JWT_ACCESS_TOKEN_EXPIRE: string,
    JWT_REFRESH_TOKEN_EXPIRE: string,
    BCRYPT_SALT_ROUNDS: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string
}

const envloader = () : envarInterface => {
    const requiredEnv : string[] = ["PORT", "DB_URL", "JWT_SECRET", "NODE_ENV", "JWT_ACCESS_TOKEN_EXPIRE", "JWT_REFRESH_TOKEN_EXPIRE", "BCRYPT_SALT_ROUNDS", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD"];

    requiredEnv.forEach((env) => {
        if(!process.env[env]) {
            throw new Error(`Missing environment variable: ${env}`);
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        NODE_ENV: process.env.NODE_ENV as string,
        JWT_ACCESS_TOKEN_EXPIRE: process.env.JWT_ACCESS_TOKEN_EXPIRE as string,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_TOKEN_EXPIRE: process.env.JWT_REFRESH_TOKEN_EXPIRE as string
    }
}
export const envVariables = envloader();

