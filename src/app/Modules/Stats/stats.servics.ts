import { IsActive } from "../User/user.interface";
import { User } from "../User/user.model";

const now = new Date();
const lastSevenDays = new Date(now).setDate(now.getDate() - 7);
const lastThirtyDays = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {

    const totalUsersPromise = User.countDocuments()
    const totalActiveUser = User.countDocuments({ isActive: IsActive.ACTIVE });
    const totalInactiveUser = User.countDocuments({ isActive: IsActive.INACTIVE });
    const totalBlockedUser = User.countDocuments({ isActive: IsActive.BLOCKED });

    const lastSevenDaysUsersPromise = User.countDocuments({ createdAt: { $gte: new Date(lastSevenDays) } });

    const lastThirtyDaysUsersPromise = User.countDocuments({ createdAt: { $gte: new Date(lastThirtyDays) } });

    const userByRolePromise = User.aggregate([

        {
            $group : {
                _id : "$role",
                count : { $sum : 1 }
            }
        }
    ])

    const [totalUsers, totalActive, totalInactive, totalBlocked, newUsersInLast7Days, newUsersInLast30Days , userByRole] = await Promise.all([
        totalUsersPromise,
        totalActiveUser,
        totalInactiveUser,
        totalBlockedUser,
        lastSevenDaysUsersPromise,
        lastThirtyDaysUsersPromise,
        userByRolePromise
    ]);

    return {
        totalUsers,
        totalActive,
        totalInactive,
        totalBlocked,
        newUsersInLast7Days,
        newUsersInLast30Days,
        userByRole
    };
}



export const StatsService = {
    getUserStats
};