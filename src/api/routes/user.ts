import { Router} from 'express';
import checkAuth from "../middleware/check_auth";

const route = Router();
const userController = require('../controllers/userController');

export default (app: Router) => {
    app.use('/user', route);

    //* GET CALLS
    route.get('/all',   userController.getAllUsers);
    route.get('/', userController.getUserBySessionId);
    route.get('/recommend', userController.recommendUser);
    route.get('/locRecommend',userController.locRecommend);

    //* POST CALLS
    route.post('/', checkAuth, userController.createUser);
    route.post('/createSkills', checkAuth, userController.createSkills);
    route.post('/createInterests', checkAuth, userController.createInterests);

    //* PUT CALLS
    route.put('/', checkAuth, userController.updateUserAge);

    //* DELETE CALLS
    route.delete('/', checkAuth, userController.deleteUser);
};
