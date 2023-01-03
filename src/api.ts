import express from "express";
import cors from "cors";
import routes from "./routes";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({
    verify: (req, res, buf) => req["rawBody"] = buf,
}));
app.use(express.json());
app.use("/api", routes);

export default app;