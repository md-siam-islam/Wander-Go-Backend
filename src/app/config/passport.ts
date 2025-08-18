import { AuthController } from './../Modules/Auth/auth.controller';
import  bcryptjs from 'bcryptjs';
import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVariables } from "./env";
import { User } from "../Modules/User/user.model";
import { Role } from "../Modules/User/user.interface";
import { Strategy as LocalStrategy } from "passport-local";


// Local Strategy for login with email + password
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email: string, password: string, done) => {
      try {
        // user matching
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "Invalid email or password" });
        }

        // check user is login with google or not 

        const Authonication = user.auth.some(Provider => Provider.Provider === "Google")

        if (Authonication) {
          return done(null, false, { message: "You Have Authenticated with Google. So if you want to login with Credentials then as first login with Google and set your password for your account and then try login with credentials." });
        }

        // password matching
        const isMatch = await bcryptjs.compare(password as string, user.password as string);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user);

      } catch (error) {
        return done(error);
      }
    }
  )
);



passport.use(
    new GoogleStrategy(
        {
      clientID: envVariables.GOOGLE_CLIENT_ID,
      clientSecret: envVariables.GOOGLE_CLIENT_SECRET,
      callbackURL: envVariables.GOOGLE_CALLBACK_URI
    }, 
    async (accessToken: string , refreshToken : string , profile : Profile , Done: VerifyCallback) => {
            try {
                const email = profile.emails?.[0].value;
                if(!email){
                    return Done(null , false, {message : "Email not found in Google profile"});
                }

                const user = await User.findOne({email})

                if(!user){
                    const user = await User.create({
                        email,
                        name: profile.displayName,
                        photo : profile.photos?.[0].value,
                        role: Role.USER,
                        auth: [{
                            Provider: "google",
                            ProviderId: profile.id
                        }],
                        isVerified: true,

                    });
                    return Done(null, user);
                }

            } catch (error) {
                console.error("Error during Google OAuth:", error);
                Done(error);
            }
        }
    )
); 


passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
