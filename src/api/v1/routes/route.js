const route = require('express').Router();
const controller = require('../controllers/controller');
const middleware = require('../middlewares/middleware');

//route.use(express.json());

route.get('/ping', controller.ping);

route.post('/users/signup', controller.signup);

route.post('/login', controller.login);

route.get("/email_verify/:id", controller.verifyEmailLink);

route
    .route("/")
    .get(middleware.authorization, controller.getUserProfile)
    .put(middleware.authorization, controller.updateCurrentUser);

route.get('/users/:id',middleware.authorization,controller.finduserbyusername);

route.post('/search', middleware.authorization,controller.search);

route.post("/forgot_password", controller.forgotPassword);

route.post("/update_password", controller.updatePassword);

module.exports = route;

