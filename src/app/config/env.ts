import dotenv from "dotenv";
dotenv.config();


interface envarInterface {
    PORT: string,
    DB_URL: string,
    JWT_SECRET: string,
    NODE_ENV: string
}

const envloader = () : envarInterface => {
    const requiredEnv : string[] = ["PORT", "DB_URL", "JWT_SECRET", "NODE_ENV"];

    requiredEnv.forEach((env) => {
        if(!process.env[env]) {
            throw new Error(`Missing environment variable: ${env}`);
        }
    })
    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        NODE_ENV: process.env.NODE_ENV as string
    }
}
export const envVariables = envloader();

