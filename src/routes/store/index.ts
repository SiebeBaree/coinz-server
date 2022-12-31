import { Router } from "express"
import {
    storeItemsController,
    storeTiersController,
} from '../../controllers/store'

const router = Router();

router.get("/all", storeItemsController);
router.get("/tiers", storeTiersController);

export default router;