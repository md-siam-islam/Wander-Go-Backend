import  bcryptjs  from 'bcryptjs';
import { User } from "../User/user.model"
import { IAuthprovider, IUser, Role } from '../User/user.interface';
import { object } from 'zod/v3/external.cjs';

export const seedSuperAdmin = async () => {

   try {
   const SuperAdminEmail = "admin@example.com"

   const Admin = await User.findOne({email:SuperAdminEmail})

   if(Admin) {
       console.log("Super Admin already exists")
       return
   }

   const superAdminPassword = await bcryptjs.hash("SuperAdminPassword123", 10);

   const authProvider: IAuthprovider = {
         Provider: "Credential",
         ProviderId: SuperAdminEmail
   }

   const payload : IUser = {
        name: "Super Admin",
       email: SuperAdminEmail,
       password: superAdminPassword,
       isVerified: true,
       role: Role.SUPER_ADMIN,
       auth: [authProvider]
   };

   const superAdmin = await User.create(payload);
    console.log("Super Admin seeded successfully:", superAdmin.email);

   } catch (error) {
       console.error("Error seeding super admin:", error);

   }
}