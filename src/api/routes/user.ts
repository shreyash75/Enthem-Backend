import { Router, Request, Response, NextFunction } from 'express';
import { driver, auth } from "neo4j-driver";
import config from "../../config";

const route = Router();

//! Solve Container.get(logger) issue
export default (app: Router) => {
    app.use('/user', route);

    const db = driver(config.databaseURL, auth.basic(config.dbUser, config.dbPass),
        {/* encrypted: 'ENCRYPTION_OFF' */ });

    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
                `
                MATCH (n:User)
                RETURN n;
                `;

            const session = db.session({ database: "neo4j" });
            const result = await session.run(query);
            console.log("RESULT:");
            result.records.forEach(i=>console.log(i.get("n").properties));

            return res.status(201).json({ "Server Working": true });
        } catch (e) {
            return next(e);
        }
    });
};
