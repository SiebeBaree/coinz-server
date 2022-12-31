import { Router } from "express";
import { checkoutsController, subscribeController, webhookController } from "../../controllers/stripe";
import { runAsync } from "../../utils/helpers";

const router = Router();

router.post("/checkout", runAsync(checkoutsController));
router.post("/subscribe", runAsync(subscribeController));
router.post("/webhooks", runAsync(webhookController));

export default router;