import { Request, Response, NextFunction } from "express";

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    req.user ? next() : res.sendStatus(401).send("You are not authorized to view this page.");
}