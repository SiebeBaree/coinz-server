import express from "express";
import cors from "cors";
import routes from "./routes";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URI,
        ttl: 60 * 60 * 24 * 7,
        dbName: "coinz_v3_beta",
    }),
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", routes);

export default app;