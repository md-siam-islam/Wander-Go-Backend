import { Response } from "express";

interface Imeta {
    total : number
}
interface Tresponse<T>{
    statuscode : number;
    success : boolean;
    message : string;
    data : T;
    meta ?: Imeta ;
}

export const  Sendresponse = <T>(res:Response, data:Tresponse<T>) => {

    res.status(data.statuscode).json({
        success : data.success,
        message : data.message,
        data : data.data,
        meta : data.meta
    })
}