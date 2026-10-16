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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_1 = require("./app/route/index");
const golobalerrorhandle_1 = require("./globalErrorHandale/golobalerrorhandle");
const routenotfound_1 = require("./app/RoutNotFOund/routenotfound");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
require("./app/config/passport"); // Ensure passport configuration is loaded
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./app/config/env");
const app = (0, express_1.default)();
// Ensure database connection in serverless environments (e.g. Vercel cold starts)
app.use((_req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (mongoose_1.default.connection.readyState !== 1) {
            yield mongoose_1.default.connect(env_1.envVariables.DB_URL);
        }
        next();
    }
    catch (error) {
        next(error);
    }
}));
app.use((0, express_session_1.default)({
    secret: env_1.envVariables.EXPRESS_SESSION_SECRET || "wandergo_session_secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(express_1.default.json());
app.set('trust proxy', 1);
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.envVariables.FRONTEND_URL,
    credentials: true,
}));
app.use("/api/v1", index_1.router);
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.use(golobalerrorhandle_1.globalErrorHandle);
app.use(routenotfound_1.routnotfound);
exports.default = app;
