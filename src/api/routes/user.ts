import { Router, Request, Response, NextFunction } from 'express';
import { driver, auth } from "neo4j-driver";
import config from "../../config";

const route = Router();
const userController = require('../controllers/userController');



//! Solve Container.get(logger) issue
export default (app: Router) => {
    app.use('/user', route);


    route.put('/', userController.updateUserAge);
    route.get('/', userController.getUserBySessionId);
    route.post('/', userController.createUser);
    route.delete('/', userController.deleteUser);
    route.get('/recommend',userController.recommendUser);

     

};
