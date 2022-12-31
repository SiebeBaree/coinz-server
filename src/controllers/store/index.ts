import { Request, Response } from "express"
import { promises } from "fs";
let store: StoreItems;

interface StoreItems {
    tiers: PremiumTier[];
    ticketPrice: number;
    lastUpdated?: number;
}

interface PremiumTier {
    name: string;
    price: number;
    botperks: string[];
    serverperks: string[];
}

async function loadStore() {
    if (store === undefined) {
        const data = await promises.readFile('./src/assets/store.json', 'utf-8');
        store = JSON.parse(data) as StoreItems;
        store.lastUpdated = Date.now();
    }
}

export async function storeItemsController(req: Request, res: Response) {
    try {
        await loadStore();
    } catch {
        res.status(500).send('Internal Server Error');
        return;
    }

    res.setHeader('Content-type', 'application/json');
    res.send(store);
}

export async function storeTiersController(req: Request, res: Response) {
    try {
        await loadStore();
    } catch {
        res.status(500).send('Internal Server Error');
        return;
    }

    res.setHeader('Content-type', 'application/json');
    res.send(store.tiers);
}