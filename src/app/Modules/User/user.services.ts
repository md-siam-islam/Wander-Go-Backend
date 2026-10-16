
import httpStatus from 'http-status-codes';
import { Jwt, JwtPayload } from "jsonwebtoken";
import { IAuthprovider, IUser, Role, IsActive } from "./user.interface";
import { User } from "./user.model";
import bcryptjs from "bcryptjs";
import { envVariables } from "../../config/env";

const Createuser = async (payload: Partial<IUser>) => {

    const { email,password, ...rest } = payload

    const isUserExist = await User.findOne({ email });

   if (isUserExist) {
     throw new Error(" This Email User already exists");
   }

    // const emailExists = await User.findOne({ email });

//    if (emailExists) {
//         const error: any = new Error("User already exists");
//         error.statusCode = 409; 
//         throw error;
//     }

    const hashedPassword = await bcryptjs.hash(password as string , Number(envVariables.BCRYPT_SALT_ROUNDS))
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

    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
        if(decodedToken.userId !== userId){
            throw new Error("You are not authorized to update other user profile");
        }
    }
    const user = await User.findById(userId);

    if(!user){
        throw new Error("User not found from UpdateUser");
    }

    if(decodedToken.role === Role.ADMIN && user.role === Role.SUPER_ADMIN ){
        throw new Error("You are not authorized to update Super Admin profile");
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

    const updateUser = await User.findByIdAndUpdate(userId, payload, {new : true , runValidators: true});

    return updateUser


}

import { QueryBuilder } from "../utils/QueryBulder";

const AllUser = async (query: Record<string, string>) => {
    const userSearchFields = ["name", "email", "phone"];
    const modelQuery = new QueryBuilder(
        User.find({ isDeleted: false }).select('-password -auth'),
        query
    );

    const users = await modelQuery
        .search(userSearchFields)
        .filter()
        .sort()
        .field()
        .pagination();

    const [data, meta] = await Promise.all([
        users.build(),
        modelQuery.Getmeta()
    ]);

    return {
        data,
        meta
    };
}
const GetMyProfile = async (decodedToken: JwtPayload) => {

    const user = await User.findById(decodedToken.userId).select('-password -auth -isDeleted -createdAt -updatedAt');

    return {
        data : user
    }
}

const getSingleUser = async (userId : string) => {

    const user = await User.findById(userId).select('-password -auth -isDeleted -createdAt -updatedAt');       

    if(!user){
        throw new Error("User not found from getSingleUser");
    }

    return user
}

const getAllGuides = async () => {
    const guides = await User.find({ role: Role.GUIDE, isDeleted: false })
        .select('-password -auth -isDeleted -createdAt -updatedAt');
    return guides;
};

const deleteUser = async (userId: string, decodedUser: JwtPayload) => {
    const targetUser = await User.findById(userId);
    if (!targetUser) {
        throw new Error("User not found");
    }

    if (targetUser._id.toString() === decodedUser.userId) {
        throw new Error("You cannot delete your own account");
    }

    if (targetUser.role === Role.SUPER_ADMIN) {
        throw new Error("Super Admin account cannot be deleted");
    }

    if (decodedUser.role === Role.ADMIN && targetUser.role === Role.ADMIN) {
        throw new Error("Admin cannot delete another Admin");
    }

    targetUser.isDeleted = true;
    targetUser.isActive = IsActive.INACTIVE;
    await targetUser.save();

    return targetUser;
};

export const UserServices = {
    Createuser,
    AllUser,
    UpdateUser,
    GetMyProfile,
    getSingleUser,
    getAllGuides,
    deleteUser
}