import { Request, Response } from "express";
import { getShopService } from "../../services/shop";

export const getShopController = async (req: Request, res: Response) => {
    try {
        res.send(await getShopService());
    } catch (error) {
        res.status(500).send({ error: "Server Error" });
    }
};