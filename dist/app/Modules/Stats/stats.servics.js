"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const user_interface_1 = require("../User/user.interface");
const user_model_1 = require("../User/user.model");
const now = new Date();
const lastSevenDays = new Date(now).setDate(now.getDate() - 7);
const lastThirtyDays = new Date(now).setDate(now.getDate() - 30);
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsersPromise = user_model_1.User.countDocuments();
    const totalActiveUser = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.ACTIVE });
    const totalInactiveUser = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.INACTIVE });
    const totalBlockedUser = user_model_1.User.countDocuments({ isActive: user_interface_1.IsActive.BLOCKED });
    const lastSevenDaysUsersPromise = user_model_1.User.countDocuments({ createdAt: { $gte: new Date(lastSevenDays) } });
    const lastThirtyDaysUsersPromise = user_model_1.User.countDocuments({ createdAt: { $gte: new Date(lastThirtyDays) } });
    const userByRolePromise = user_model_1.User.aggregate([
        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);
    const [totalUsers, totalActive, totalInactive, totalBlocked, newUsersInLast7Days, newUsersInLast30Days, userByRole] = yield Promise.all([
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
});
exports.StatsService = {
    getUserStats
};
