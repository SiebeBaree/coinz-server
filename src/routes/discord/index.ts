import { Router } from "express"
import {
    callbackController,
    refreshController,
    revokeController
} from '../../controllers/discord'

const router = Router();

router.post("/callback", callbackController);
router.post("/refresh", refreshController);
router.post("/revoke", revokeController);
router.get("/user", revokeController);

export default router;