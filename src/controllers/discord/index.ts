import { Request, Response } from "express";
import { IWebUser } from "../../models/WebUser";
import { getUserService } from "../../services/discord";

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