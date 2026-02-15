"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envVariables = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envloader = () => {
    const requiredEnv = ["PORT", "DB_URL", "JWT_SECRET", "NODE_ENV", "JWT_ACCESS_TOKEN_EXPIRE", "JWT_REFRESH_TOKEN_EXPIRE", "BCRYPT_SALT_ROUNDS", "SUPER_ADMIN_EMAIL", "SUPER_ADMIN_PASSWORD", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_CALLBACK_URI", "EXPRESS_SESSION_SECRET", "FRONTEND_URL", "SSL_STORE_ID", "SSL_STORE_PASS", "SSL_PAYMENT_API", "SSL_VALIDATION_API", "SSL_SUCCESS_BACKEND_URL",
        "SSL_FAIL_BACKEND_URL",
        "SSL_CANCEL_BACKEND_URL",
        "SSL_SUCCESS_FRONTEND_URL",
        "SSL_FAIL_FRONTEND_URL",
        "SSL_CANCEL_FRONTEND_URL",
        "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "SMTP_FROM_EMAIL",
        "REDIS_HOST", "REDIS_PORT", "REDIS_PASSWORD", "REDIS_USERNAME"
    ];
    requiredEnv.forEach((env) => {
        if (!process.env[env]) {
            throw new Error(`Missing environment variable: ${env}`);
        }
    });
    return {
        PORT: process.env.PORT,
        DB_URL: process.env.DB_URL,
        JWT_SECRET: process.env.JWT_SECRET,
        NODE_ENV: process.env.NODE_ENV,
        JWT_ACCESS_TOKEN_EXPIRE: process.env.JWT_ACCESS_TOKEN_EXPIRE,
        BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
        JWT_REFRESH_TOKEN_EXPIRE: process.env.JWT_REFRESH_TOKEN_EXPIRE,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_CALLBACK_URI: process.env.GOOGLE_CALLBACK_URI,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
        FRONTEND_URL: process.env.FRONTEND_URL,
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID,
            SSL_STORE_PASS: process.env.SSL_STORE_PASS,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
            SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
            SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
            SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
            SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
        },
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
        },
        EMAIL_SENDER: {
            SMTP_HOST: process.env.SMTP_HOST,
            SMTP_PORT: process.env.SMTP_PORT,
            SMTP_USER: process.env.SMTP_USER,
            SMTP_PASS: process.env.SMTP_PASS,
            SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL
        },
        REDIS: {
            REDIS_HOST: process.env.REDIS_HOST,
            REDIS_PORT: process.env.REDIS_PORT,
            REDIS_PASSWORD: process.env.REDIS_PASSWORD,
            REDIS_USERNAME: process.env.REDIS_USERNAME
        }
    };
};
exports.envVariables = envloader();
