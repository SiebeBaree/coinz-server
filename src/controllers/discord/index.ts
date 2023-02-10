import { Request, Response } from "express";
import { IWebUser } from "../../models/WebUser";
import { getUserService, getMemberService, getPremiumService } from "../../services/discord";

export const getUserController = async (req: Request, res: Response) => {
    const user = req.user as IWebUser;
    if (user === undefined) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    try {
        const { data } = await getUserService(user.id);
        res.send(data);
    } catch (error) {
        res.status(401).send({ error: "Unauthorized" });
    }
};

export const getMemberController = async (req: Request, res: Response) => {
    const user = req.user as IWebUser;
    if (user === undefined) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    try {
        const data = await getMemberService(user.discordId);
        res.send(data);
    } catch (error) {
        res.status(401).send({ error: "Unauthorized" });
    }
};

export const getPremiumController = async (req: Request, res: Response) => {
    const user = req.user as IWebUser;
    if (user === undefined) {
        res.status(401).send({ error: "Unauthorized" });
        return;
    }

    try {
        const data = await getPremiumService(user.discordId);
        res.send(data);
    } catch (error) {
        res.status(401).send({ error: "Unauthorized" });
    }
};