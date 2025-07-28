
import { Jwt, JwtPayload } from "jsonwebtoken";
import { IAuthprovider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";

const Createuser = async (payload: Partial<IUser>) => {

    const { email,password, ...rest } = payload

    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcryptjs.hash(password as string , 10)
    console.log(hashedPassword)

    // const isExixt = await bcrypt.compare(password as string , hashedPassword)
    // console.log(isExixt);

    const authProvider : IAuthprovider = { Provider : "Credential" , ProviderId : email as string}

    const user = await User.create({
        email,
        password: hashedPassword,
        auth: [authProvider],
        ...rest
    })

    return user
}


const UpdateUser = async(userId : string , payload : Partial<IUser> , decodedToken : JwtPayload) => {
    const user = await User.findById(userId);

    if(!user){
        throw new Error("User not found");
    }

    if(payload.role){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new Error("You are not authorized to update user role");
        }
        if(payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN){
            throw new Error("You are not authorized to update user role");
        }
    }

    if(payload.isActive || payload.isVerified || payload.isDeleted){
        if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
            throw new Error("You are not authorized to update user status");
        }
    }

    if(payload.password){
        const hashedPassword = await bcryptjs.hash(payload.password as string , 10)
        payload.password = hashedPassword
    }
    const updateUser = await User.findByIdAndUpdate(userId, payload, {new : true , runValidators: true});

    return updateUser


}

const AllUser = async () => {

    const user = await User.find({})
    const totalUser = await User.countDocuments() 

    return {
        data : user,
        meta : {
            total : totalUser
        }
    }
}

export const UserServices = {
    Createuser,
    AllUser,
    UpdateUser
}