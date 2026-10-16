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

        server = app.listen(PORT , () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to connect to database:", error);
    }
}  

(async () => {
    await connectRedis();
    await StartServer();
    await seedSuperAdmin();
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