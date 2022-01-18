const route = require('express').Router();
const controller = require('../controllers/friend_controller');
const middleware = require('../middlewares/middleware');

route.get('/myfriends', middleware.authorization, controller.getmyfriends);
route.post('/sendrequest', middleware.authorization, controller.sendrequest);
route.post('/accept', middleware.authorization, controller.acceptrequest);
route.post('/reject', middleware.authorization, controller.rejectrequest);
route.post('/remove', middleware.authorization, controller.removefriend);
route.post('/block', middleware.authorization, controller.block);

module.exports = route;

