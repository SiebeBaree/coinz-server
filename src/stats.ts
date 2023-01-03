import ShardingStats from "sharding-stats";
import { Application } from "express";

export default class Stats {
    public readonly statsServer: ShardingStats.Server;

    constructor(app: Application) {
        this.statsServer = new ShardingStats.Server(app, {
            selfHost: true,
            stats_uri: process.env.WEB_API_URL + "/",
            authorizationkey: process.env.API_SHARDINGSTATS,
            bot: { name: "s", icon: "s", website: "s", client_id: "s", client_secret: "s" }, redirect_uri: "s",
            owners: ["643072638075273248"],
        });

        this.statsServer.on("error", console.error);
    }
}