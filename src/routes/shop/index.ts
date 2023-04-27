import { Router } from "express";
import { getShopController } from "../../controllers/shop";

const router = Router();

router.get("/shop", getShopController);

export default router;