import { Request, Response } from "express";

export async function loginController(req: Request, res: Response) {
    res.redirect("/updates");
}

export async function redirectController(req: Request, res: Response) {
    res.redirect("/updates");
}