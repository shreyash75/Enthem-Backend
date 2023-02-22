import { Router, Request, Response, NextFunction } from 'express';
import { driver, auth } from "neo4j-driver";
import config from "../../config";

const route = Router();


//! Solve Container.get(logger) issue
export default (app: Router) => {
    app.use('/user', route);

    const db = driver(config.databaseURL, auth.basic(config.dbUser, config.dbPass),
        {/* encrypted: 'ENCRYPTION_OFF' */ },);
    
    const session = db.session({ database: "neo4j" });
        
    // Get User Data
    route.get('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
            `
            MATCH (n:User{sessionId:"${req.body.sessionId}"})
            RETURN n;
            `;
            
            const result = await session.run(query);
            console.log("RESULT:");
            const resultList = [];
            result.records.forEach(i=> resultList.push(i.get("n").properties));
            
            return res.status(201).json({ "status": 200, "data": resultList});
        } catch (e) {
            return next(e);
        }
    });  

    // Create User Data
    route.post('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
                `
                MERGE (u:User {sessionId:"${req.body.sessionId}"})
                ON CREATE SET u.sessionId="${req.body.sessionId}", 
                                u.name = "${req.body.username}",
                                u.emailId="${req.body.email}",
                                u.gender = COALESCE("${req.body.gender}","Unknown"),
                                u.age = COALESCE(${req.body.age},20),
                                u.latitude=${req.body.latitude},
                                u.longitude=${req.body.longitude}
                RETURN u

                `;
    
                const result = await session.run(query);
                console.log("RESULT:");
                const resultList = [];
                result.records.forEach(i=> resultList.push(i.get("u").properties));
                
                return res.status(201).json({ "status": 200, "data": resultList});
        } catch (e) {
            return next(e);
        }
    });

    // Update User Data
    route.put('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
                `
                MATCH (u:User {sessionId:"${req.body.sessionId}"}) SET u.age= ${req.body.age} RETURN u
                `;


                const result = await session.run(query);
                console.log("RESULT:");
                const resultList = [];
                result.records.forEach(i=> resultList.push(i.get("u").properties));
                
                return res.status(201).json({ "status": 200, "data": resultList});
        } catch (e) {
            return next(e);
        }
    });    

    // Delete User Data
    route.delete('/', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
                `
                MATCH (u:User {sessionId: "${req.body.sessionId}"}) DETACH DELETE u
                `;

            const result = await session.run(query);
            console.log("User Profile Deleted Successfully !");
        } catch (e) {
            return next(e);
        }
    });

    //recommend by location and skills if any single match
    route.get('/recommend', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query =
            `
            MATCH (u:User)-[:HAS_SKILL]->(s:Activity)<-[:HAS_SKILL]-(u2:User)
            WHERE u.sessionId = "${req.body.sessionId}"
            AND u.latitude IS NOT NULL AND u.longitude IS NOT NULL 
            AND u2.sessionId <> u.sessionId 
            AND u2.latitude IS NOT NULL AND u2.longitude IS NOT NULL 
            WITH u, u2, s, u.latitude * pi() / 180 AS lat1, u.longitude * pi() / 180 AS lon1,
                u2.latitude * pi() / 180 AS lat2, u2.longitude * pi() / 180 AS lon2,
                6371 * 2 AS r 
            WITH u, u2, s, lat1, lon1, lat2, lon2, r,
                sin((lat2 - lat1) / 2) AS a,
                sin((lon2 - lon1) / 2) AS b,
                cos(lat1) AS c,
                cos(lat2) AS d
            WITH u, u2, s, r * asin(sqrt(a^2 + c * d * b^2)) AS distance
            WHERE distance <=10
            RETURN u2

            `;
            
            const result = await session.run(query);
            console.log("RESULT:");
            const resultList = [];
            result.records.forEach(i=> resultList.push(i.get("u2").properties));
            
            return res.status(201).json({ "status": 200, "data": resultList});
        } catch (e) {
            return next(e);
        }
    });  

};
