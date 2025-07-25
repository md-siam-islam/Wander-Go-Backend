import { IAuthprovider, IUser } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const Createuser = async (payload: Partial<IUser>) => {

    const { email,password, ...rest } = payload

    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password as string , 10)
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
    AllUser
}