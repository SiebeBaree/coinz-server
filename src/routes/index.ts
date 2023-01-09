import { Router } from "express";
import authRoutes from "./auth";
import discordRoutes from "./discord";

const router = Router();

router.use("/auth", authRoutes);
router.use("/discord", discordRoutes);

export default router;