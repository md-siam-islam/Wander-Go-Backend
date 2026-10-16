import {Server} from "http"
import mongoose from "mongoose";
import app from "./app";
import { seedSuperAdmin } from "./app/Modules/utils/seedSuperAdmin";
import { envVariables } from "./app/config/env";
import { connectRedis } from "./app/config/redis.config";

let server : Server ;
const PORT = envVariables.PORT || 5000;

async function StartServer() {
    try {
        await mongoose.connect(envVariables.DB_URL);
        console.log("✅ Connected to MongoDB successfully");

        if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
            server = app.listen(PORT , () => {
                console.log(`🚀 Server running on port ${PORT}`);
            });
        }
    } catch (error) {
        console.error("❌ Failed to connect to database:", error);
    }
}  

(async () => {
    await StartServer();

    try {
        await connectRedis();
    } catch (error) {
        console.warn("⚠️ Redis init skipped:", error);
    }

    try {
        await seedSuperAdmin();
    } catch (error) {
        console.warn("⚠️ Super Admin seed warning:", error);
    }
})();

process.on("SIGTERM" , () => {
    console.log("Server shut down");

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

process.on("unhandledRejection" , (error) => {
    console.log("Unhandled Rejection error", error);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("uncaughtException" , (error) => {
    console.log("Uncaught Exception error", error);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
})

export default app;