import express from "express";
import config from "./config";
import Logger from "./loaders/logger";

async function startServer() {
    const app = express();

    await require('./loaders').default({ expressApp: app });

    app.listen(config.port, () => {
        Logger.info(`🔥🔥 Database Server connected on : ${config.databaseURL}🔥🔥 `);
        Logger.info(`🔥🔥 Server listening on port: ${config.port}🔥🔥 `);
    }).on('error', (err: any) => {
        Logger.error(err);
        process.exit(1);
    });
}

startServer();
