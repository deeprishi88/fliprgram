const route = require('express').Router();
const controller = require('../controllers/controller');
const middleware = require('../middlewares/middleware');

//route.use(express.json());

route.get('/ping', controller.ping);

route.post('/users/signup', controller.signup);

route.post('/login', controller.login);

route.get('/users/:id',middleware.protect,controller.finduserbyusername);

route.post('/search', middleware.protect, controller.search);

module.exports = route;

