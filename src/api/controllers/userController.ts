import { Router, Request, Response, NextFunction } from 'express';
import { driver, auth } from "neo4j-driver";
import config from "../../config";

const db = driver(config.databaseURL, auth.basic(config.dbUser, config.dbPass),
        {/* encrypted: 'ENCRYPTION_OFF' */ },);
    
    const session = db.session({ database: "neo4j" });

const updateUserAge = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = `
      MATCH (u:User {id:"${req.body.id}"})
      SET u.age = ${req.body.age}
      RETURN u
    `;
    const result = await session.run(query);
    const resultList = result.records.map((record) => record.get('u').properties);
    return res.status(201).json({ status: 200, data: resultList });
  } catch (e) {
    return next(e);
  }
};


const getUserBySessionId = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const query = `
      MATCH (n:User {id:"${req.body.id}"})
      RETURN n;
    `;
    const result = await session.run(query);
    const resultList = result.records.map((record) => record.get('n').properties);
    return res.status(200).json({ status: 200, data: resultList });
  } catch (e) {
    return next(e);
  }
};


const createUser = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const query = `
      MERGE (u:User {id:"${req.body.id}"})
      ON CREATE SET u.id="${req.body.id}",
                    u.name = "${req.body.username}",
                    u.emailId="${req.body.email}",
                    u.gender = COALESCE("${req.body.gender}","Unknown"),
                    u.age = COALESCE(${req.body.age},20),
                    u.latitude=${req.body.latitude},
                    u.longitude=${req.body.longitude}
      RETURN u
    `;
    const result = await session.run(query);
    const resultList = result.records.map((record) => record.get('u').properties);
    return res.status(200).json({ status: 200, data: resultList });
  } catch (e) {
    return next(e);
  }
};


const deleteUser= async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const query = `
      MATCH (u:User {id: "${req.body.id}"})
      DETACH DELETE u
    `;
    await session.run(query);
    console.log("User Profile Deleted Successfully !");
    return res.sendStatus(204);
  } catch (e) {
    return next(e);
  }
};


const recommendUser=async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const query = `
      MATCH (u:User)-[:HAS_SKILL]->(s:Activity)<-[:HAS_SKILL]-(u2:User)
      WHERE u.id = "${req.body.id}"
      AND u.latitude IS NOT NULL AND u.longitude IS NOT NULL 
      AND u2.id <> u.id 
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
      WHERE distance <=100
      RETURN DISTINCT u2
    `;

    const result = await session.run(query);
    console.log("RESULT:");
    const resultList = [];
    result.records.forEach((i) => resultList.push(i.get("u2").properties));

    return res.status(201).json({ status: 200, data: resultList });
  } catch (e) {
    return next(e);
  }
};

const createSkills=async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const skills = req.body.skills.map(skill => `"${skill}"`).join(', ');
    const query = `
      WITH [${skills}] AS skillsList
      UNWIND skillsList AS skill
      MERGE (s:Activity {name:skill})
      WITH s
      MATCH (u:User {id:"${req.body.id}"})
      MERGE (u)-[:HAS_SKILL]->(s)
    `;

    const result = await session.run(query);
    console.log("RESULT:");
    const resultList = "Done Skills";

    return res.status(201).json({ status: 200, data: resultList });
  } catch (e) {
    return next(e);
  }
};

const createInterests=async (req: Request, res: Response, next: NextFunction)=>{
  try {
    const interests = req.body.interests.map(interest => `"${interest}"`).join(', ');
    const query = `
      WITH [${interests}] AS interestsList
      UNWIND interestsList AS interest
      MERGE (s:Activity {name:interest})
      WITH s
      MATCH (u:User {id:"${req.body.id}"})
      MERGE (u)-[:HAS_INTEREST]->(s)
    `;

    const result = await session.run(query);
    console.log("RESULT:");
    const resultList = "Done Interests";

    return res.status(201).json({ status: 200, data: resultList });
  } catch (e) {
    return next(e);
  }
};


module.exports = {
  updateUserAge,
  getUserBySessionId,
  createUser,
  deleteUser,
  recommendUser,
  createSkills,
  createInterests,
};
