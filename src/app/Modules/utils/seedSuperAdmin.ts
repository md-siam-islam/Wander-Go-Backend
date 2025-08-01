import bcryptjs from "bcryptjs";
import { User } from "../User/user.model";
import { IAuthprovider, IUser, Role } from "../User/user.interface";
import { envVariables } from "../../config/env";

export const seedSuperAdmin = async () => {
  try {
    const superAdminEmail = envVariables.SUPER_ADMIN_EMAIL;
    const superAdminPasswordRaw = envVariables.SUPER_ADMIN_PASSWORD;
    const saltRounds = Number(envVariables.BCRYPT_SALT_ROUNDS) || 10;

    // Check if already exists
    const existingAdmin = await User.findOne({ email: superAdminEmail });

    if (existingAdmin) {
      console.log("✅ Super Admin already exists:", existingAdmin.email);
      return;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(superAdminPasswordRaw, saltRounds);

    const authProvider: IAuthprovider = {
      Provider: "Credential",
      ProviderId: superAdminEmail,
    };

    const payload: IUser = {
      name: "Super Admin",
      email: superAdminEmail ,
      password: hashedPassword,
      isVerified: true,
      role: Role.SUPER_ADMIN,
      auth: [authProvider],
    };

    const superAdmin = await User.create(payload);
    console.log("🎉 Super Admin seeded successfully:", superAdmin.email);

  } catch (error) {
    console.error("❌ Error seeding super admin:", error instanceof Error ? error.message : error);
  }
};
