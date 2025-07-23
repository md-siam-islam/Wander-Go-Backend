import { model, Schema } from "mongoose";
import { IsActive, IUser, Role , IAuthprovider } from "./user.interface";



const AuthSchema = new Schema <IAuthprovider>({
        Provider : {type : String, required : true},
        ProviderId : {type : String, required : true}
},{
    versionKey : false,
    _id : false
})
const userSchema = new Schema <IUser> ({

    name : {type : String , required : true , trim : true},
    email : { type : String , required : true , trim : true},
    password : {type : String , unique: true, trim : true},
    phone : {type : String},
    picture : { type : String},
    address : { type : String},
    role : {
        type : String ,
        enum : Object.values(Role),
        default : Role.USER
    },
    isDeleted : { type : Boolean , default : true},
    isActive : {
        type : String,
        enum : Object.values(IsActive),
        default : IsActive.ACTIVE
    },

    isVerified : {type : Boolean , default: false},
    auth : [AuthSchema]


},{
    timestamps : true,
    versionKey : false
})

export const User = model<IUser>("User" , userSchema)