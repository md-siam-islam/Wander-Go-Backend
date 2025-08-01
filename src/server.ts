import {Server} from "http"
import mongoose from "mongoose";
import app from "./app";
import { seedSuperAdmin } from "./app/Modules/utils/seedSuperAdmin";
import { envVariables } from "./app/config/env";

let server : Server ;
const PORT = envVariables.PORT || 5000;

async function StartServer() {
    try {
        await mongoose.connect(envVariables.DB_URL)
        // await mongoose.connect("mongodb+srv://wandergo:pBf1Mto6IvEySCwN@cluster0.5b559.mongodb.net/WanderGo?retryWrites=true&w=majority&appName=Cluster0")

    server = app.listen(PORT , () => {
        console.log(`server start on port ${PORT}`);
    })
    // server = app.listen(PORT , () => {
    //     console.log(`server start on port ${PORT}`);
    // })
    } catch (error) {
        console.log(error);
    }
}  

(async () => {
    await StartServer();
    await seedSuperAdmin();
})();

process.on("SIGTERM" , () => {
    console.log("Server shout down");

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("unhandledRejection" , (error) => {
    console.log("unHandle Rejection error",error);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
})

process.on("uncaughtException" , (error) => {
    console.log("uncaughtException Rejection error",error);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
})
// pBf1Mto6IvEySCwN
// wandergo