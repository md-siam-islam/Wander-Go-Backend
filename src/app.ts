
import express, { Request, Response } from "express"
import cors from "cors"
import  {router} from './app/route/index';
import { globalErrorHandle } from "./globalErrorHandale/golobalerrorhandle";
import { routnotfound } from "./app/RoutNotFOund/routenotfound";
import cookieParser from "cookie-parser";



const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors())

app.use("/api/v1" , router)

app.get('/', (req : Request, res : Response) => {
    res.send('Hello World')
})


app.use(globalErrorHandle)
app.use(routnotfound)

export default app