import express, { Router } from "express";
import { handleStripeWebhook } from "../../services/stripe";
import { runAsync } from "../../utils/helpers";

const router = Router();

router.post("/webhooks", express.raw({ type: "application/json" }), runAsync(handleStripeWebhook));

export default router;