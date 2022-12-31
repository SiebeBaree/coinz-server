import { Router } from "express";
import discordRoutes from "./discord";
import stripeRoutes from "./stripe";
import storeRoutes from "./store";

const router = Router();

router.use("/discord", discordRoutes);
router.use("/stripe", stripeRoutes);
router.use("/store", storeRoutes);

export default router;