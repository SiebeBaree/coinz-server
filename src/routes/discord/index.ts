import { Router } from "express";
import {
    callbackController,
    refreshController,
    revokeController,
    authorizeController,
} from "../../controllers/discord";

const router = Router();

router.post("/callback", callbackController);
router.post("/refresh", refreshController);
router.post("/revoke", revokeController);
router.get("/authorize", authorizeController);

export default router;