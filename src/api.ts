import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

export default app;