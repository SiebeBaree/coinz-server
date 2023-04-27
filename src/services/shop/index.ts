import Item, { Item as ItemType } from "../../models/Item";
import cron from "node-cron";

let shop: ItemType[] = [];

export async function getShopService() {
    return shop;
}

cron.schedule("*/30 * * * *", async () => {
    await updateShop();
});

async function updateShop() {
    shop = await Item.find({}) as ItemType[];
}

(async () => {
    await updateShop();
})();