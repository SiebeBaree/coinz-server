// Environment Variables
import dotenv from "dotenv";
dotenv.config();

import { connect } from "mongoose";
import { Shard } from "./utils/types";
import { Request, Response } from "express";
import Stats from "./stats";
import app from "./api";

// Connect to MongoDB
connect(process.env.DATABASE_URI, {
    maxPoolSize: 100,
    minPoolSize: 5,
    family: 4,
    heartbeatFrequencyMS: 30000,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
}).then(() => console.log("Connected to MongoDB"));

// Start the stats server
const stats = new Stats(app).statsServer;

app.get("/stats", (req: Request, res: Response) => {
    const data = stats.getStatsData().raw.shards;
    const sorted = stats.chunkShardsToClusterArrays(data);

    const resData = [];
    for (const { cluster, shards } of sorted) {
        resData.push({
            id: cluster,
            shards: shards.map((shard: Shard) => ({
                id: shard.id,
                ping: shard.ping,
                guildcount: shard.guildcount,
                cpu: shard.cpu,
                ram: shard.ram,
            })),
        });
    }

    res.setHeader("Content-type", "application/json");
    res.send(resData);
});

const port = process.env.PORT || 3300;
app.listen(port, () => console.log(`Server is running using http on port ${port}`));

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (err: Error) => {
    console.error(err.stack);
});

process.on("unhandledRejection", (err: Error) => {
    console.error(err.stack);
});