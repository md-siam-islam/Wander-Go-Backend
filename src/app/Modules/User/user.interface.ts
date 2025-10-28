import {Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = 'GUIDE'
}

export interface IAuthprovider {
    Provider : "Google" | "Credential";
    ProviderId : string;
}
export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}


export interface IUser {
    _id :Types.ObjectId;
    name : string ;
    email : string ;
    phone ? : string ;
    password ? : string ;
    picture ? : string ;
    address ? : string ;
    isDeleted ? : string ;
    isActive ?: IsActive ;
    isVerified ?: boolean ;
    role : Role;
    auth : IAuthprovider[];
    booking ?: Types.ObjectId[];
    guides ?: Types.ObjectId[];
    createdAt ?: Date;
    updatedAt ?: Date;
}