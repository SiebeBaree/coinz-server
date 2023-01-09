import passport from "passport";
import { Strategy } from "passport-discord";
import WebUser from "../models/WebUser";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await WebUser.findById(id);

        if (user) {
            return done(null, user);
        } else {
            return done(null, null);
        }
    } catch (error) {
        return done(error as Error, null);
    }
});

passport.use(
    new Strategy({
        clientID: process.env.DISCORD_CLIENT_ID,
        clientSecret: process.env.DISCORD_CLIENT_SECRET,
        callbackURL: process.env.DISCORD_CALLBACK_URL + "/auth/redirect",
        scope: ["identify", "guilds"],
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const webUser = await WebUser.findOneAndUpdate({ discordId: profile.id }, {
                accessToken,
                refreshToken,
            }, { upsert: true, new: true });

            return done(null, webUser);
        } catch (error) {
            return done(error as Error, null);
        }
    }),
);