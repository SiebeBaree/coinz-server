import { Router } from "express";
import authRoutes from "./auth";
import discordRoutes from "./discord";
import stripeRoutes from "./stripe";

const router = Router();

router.use("/auth", authRoutes);
router.use("/discord", discordRoutes);
router.use("/stripe", stripeRoutes);

export default router;