"use strict";
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
const env_1 = require("./app/config/env");
const app = (0, express_1.default)();
app.use((0, express_session_1.default)({
    secret: "your_secret_key",
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
