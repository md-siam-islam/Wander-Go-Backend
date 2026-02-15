"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const seedSuperAdmin_1 = require("./app/Modules/utils/seedSuperAdmin");
const env_1 = require("./app/config/env");
const redis_config_1 = require("./app/config/redis.config");
let server;
const PORT = env_1.envVariables.PORT || 5000;
function StartServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(env_1.envVariables.DB_URL);
            // await mongoose.connect("mongodb+srv://wandergo:pBf1Mto6IvEySCwN@cluster0.5b559.mongodb.net/WanderGo?retryWrites=true&w=majority&appName=Cluster0")
            server = app_1.default.listen(PORT, () => {
                console.log(`server start on port ${PORT}`);
            });
            // server = app.listen(PORT , () => {
            //     console.log(`server start on port ${PORT}`);
            // })
        }
        catch (error) {
            console.log(error);
        }
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, redis_config_1.connectRedis)();
    yield StartServer();
    yield (0, seedSuperAdmin_1.seedSuperAdmin)();
}))();
process.on("SIGTERM", () => {
    console.log("Server shout down");
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("unhandledRejection", (error) => {
    console.log("unHandle Rejection error", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on("uncaughtException", (error) => {
    console.log("uncaughtException Rejection error", error);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
// pBf1Mto6IvEySCwN
// wandergo
