import { Router } from "express";
import discordRoutes from "./discord";

const router = Router();

router.use("/discord", discordRoutes);

export default router;