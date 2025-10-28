
import express, { ErrorRequestHandler, Request, Response } from "express"
import cors from "cors"
import  {router} from './app/route/index';
import { globalErrorHandle } from "./globalErrorHandale/golobalerrorhandle";
import { routnotfound } from "./app/RoutNotFOund/routenotfound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport"; // Ensure passport configuration is loaded
import { envVariables } from "./app/config/env";


const app = express();

app.use(expressSession({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.json());
app.set('trust proxy', 1);
app.use(express.urlencoded({extended : true}))
app.use(cookieParser())
app.use(cors())

app.use(cors({
    origin: envVariables.FRONTEND_URL,
    credentials: true,
}));

app.use("/api/v1" , router)

app.get('/', (req : Request, res : Response) => {
    res.send('Hello World')
})


app.use(globalErrorHandle as ErrorRequestHandler)
app.use(routnotfound)

export default app