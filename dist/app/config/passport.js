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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const env_1 = require("./env");
const user_model_1 = require("../Modules/User/user.model");
const user_interface_1 = require("../Modules/User/user.interface");
const passport_local_1 = require("passport-local");
// Local Strategy for login with email + password
passport_1.default.use(new passport_local_1.Strategy({ usernameField: "email", passwordField: "password" }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // user matching
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return done(null, false, { message: "Invalid email or password" });
        }
        // check user is login with google or not 
        const Authonication = user.auth.some(Provider => Provider.Provider === "Google");
        if (Authonication) {
            return done(null, false, { message: "You Have Authenticated with Google. So if you want to login with Credentials then as first login with Google and set your password for your account and then try login with credentials." });
        }
        // password matching
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return done(null, false, { message: "Invalid email or password" });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_1.envVariables.GOOGLE_CLIENT_ID,
    clientSecret: env_1.envVariables.GOOGLE_CLIENT_SECRET,
    callbackURL: env_1.envVariables.GOOGLE_CALLBACK_URI
}, (accessToken, refreshToken, profile, Done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        if (!email) {
            return Done(null, false, { message: "Email not found in Google profile" });
        }
        let user = yield user_model_1.User.findOne({ email });
        if (!user) {
            user = yield user_model_1.User.create({
                email,
                name: profile.displayName || "Google User",
                picture: (_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value,
                role: user_interface_1.Role.USER,
                auth: [{
                        Provider: "Google",
                        ProviderId: profile.id
                    }],
                isVerified: true,
            });
            return Done(null, user);
        }
        // If user exists, link Google provider if not already linked
        const hasGoogleAuth = user.auth.some(p => { var _a; return ((_a = p.Provider) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "google"; });
        if (!hasGoogleAuth) {
            user.auth.push({
                Provider: "Google",
                ProviderId: profile.id
            });
            yield user.save();
        }
        return Done(null, user);
    }
    catch (error) {
        console.error("Error during Google OAuth:", error);
        Done(error);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
