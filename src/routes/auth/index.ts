import { Request, Response, Router } from "express";
import passport from "passport";

const router = Router();

router.get("/login", passport.authenticate("discord"));
router.get("/redirect", passport.authenticate("discord", {
    failureRedirect: process.env.CORS_ORIGIN + "/",
}), (req: Request, res: Response) => res.redirect(process.env.CORS_ORIGIN + "/dashboard"));

export default router;