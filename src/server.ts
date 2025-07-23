import {Server} from "http"
import mongoose from "mongoose";
import app from "./app";

let server : Server ;
const PORT = process.env.PORT || 5000;

async function StartServer() {
    try {
        await mongoose.connect("mongodb+srv://wandergo:pBf1Mto6IvEySCwN@cluster0.5b559.mongodb.net/WanderGo?retryWrites=true&w=majority&appName=Cluster0")

    server = app.listen(PORT , () => {
        console.log(`server start on port ${PORT}`);
    })
    } catch (error) {
        console.log(error);
    }
}  

StartServer()

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