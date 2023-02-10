import { Router } from "express";
import { getMemberController, getUserController, getPremiumController } from "../../controllers/discord";
import { isAuthenticated } from "../../utils/middlewares";

const router = Router();

router.get("/user", isAuthenticated, getUserController);
router.get("/member", isAuthenticated, getMemberController);
router.get("/premium", isAuthenticated, getPremiumController);

export default router;