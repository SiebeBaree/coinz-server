import { Router } from "express";
import { getUserController } from "../../controllers/discord";
import { isAuthenticated } from "../../utils/middlewares";

const router = Router();

router.get("/user", isAuthenticated, getUserController);

export default router;