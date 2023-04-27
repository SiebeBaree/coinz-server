import { Router } from "express";
import shopRoutes from "./shop";

const router = Router();

router.use("/shop", shopRoutes);

export default router;