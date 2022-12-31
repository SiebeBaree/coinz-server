// Environment Variables
import dotenv from "dotenv";
dotenv.config();

// Connect to MongoDB
import { connect } from 'mongoose'
connect(process.env.DATABASE_URI, {
    dbName: process.env.NODE_ENV === 'production' ? 'coinz' : 'coinz_beta',
    maxPoolSize: 100,
    minPoolSize: 5,
    family: 4,
    heartbeatFrequencyMS: 30000,
    keepAlive: true,
    keepAliveInitialDelay: 300000
}).then(() => console.log('Connected to MongoDB'));

// Initialize Stripe
import './stripe';

// Start the API with Express
import app from './api';
import { createServer } from 'https';
import { readFileSync } from 'fs';

// Start the Stats Server
import Stats from "sharding-stats";
import { Request, Response } from "express";
import { Shard } from "./utils/types";

const StatsServer = new Stats.Server(app, {
    selfHost: true,
    stats_uri: `https://api.coinzbot.xyz/`, //Base URL 
    authorizationkey: process.env.API_SHARDINGSTATS,
    bot: { name: "s", icon: "s", website: "s", client_id: "s", client_secret: "s" }, redirect_uri: "s",
    owners: ["643072638075273248"],
});

app.get('/api/status', (req: Request, res: Response) => {
    const data = StatsServer.getStatsData().raw.shards;
    const sorted = StatsServer.chunkShardsToClusterArrays(data);

    const resData = [];
    for (const { cluster, shards } of sorted) {
        resData.push({
            id: cluster,
            shards: shards.map((shard: Shard) => ({
                id: shard.id,
                ping: shard.ping,
                guildcount: shard.guildcount,
                cpu: shard.cpu,
                ram: shard.ram
            })),
        });
    }

    res.setHeader('Content-type', 'application/json');
    res.send(resData);
});

StatsServer.on('error', console.error);

const port = process.env.PORT || 3300;
if (process.env.NODE_ENV === 'production') {
    const options = {
        key: readFileSync('/etc/ssl/coinzbot.xyz.key.pem'),
        cert: readFileSync('/etc/ssl/coinzbot.xyz.cert.pem')
    };

    createServer(options, app).listen(port, () => console.log(`Server is running using https on port ${port}`));
} else {
    app.listen(port, () => console.log(`Server is running using http on port ${port}`));
}

// Handle uncaught exceptions and unhandled rejections
const ignoredErrors = [];
process.on('uncaughtException', (err: Error) => {
    if (!ignoredErrors.includes(`${err.name}: ${err.message}`)) {
        console.error(err.stack);
    }
});

process.on('unhandledRejection', (err: Error) => {
    if (!ignoredErrors.includes(`${err.name}: ${err.message}`)) {
        console.error(err.stack);
    }
});