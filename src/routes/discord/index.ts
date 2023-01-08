import { Router } from "express";
import passport from "passport";
import { loginController, redirectController } from "../../controllers/discord";

const router = Router();

router.get("/", passport.authenticate("discord"), loginController);
router.get("/redirect", passport.authenticate("discord", {
    failureRedirect: "/",
}), redirectController);

export default router;