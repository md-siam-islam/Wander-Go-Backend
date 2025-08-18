import { Response } from "express";

interface Imeta {
    total : number
}
interface Tresponse<T>{
    statuscode : number;
    success : boolean;
    message : string;
    accessToken ?: string;
    refreshToken ?: string;
    data : T;
    meta ?: Imeta ;
}

export const  Sendresponse = <T>(res:Response, data:Tresponse<T>) => {

    res.status(data.statuscode).json({
        success : data.success,
        message : data.message,
        accessToken : data.accessToken,
        refreshToken : data.refreshToken,
        data : data.data,
        meta : data.meta
    })
}