const route = require('express').Router();
const multer = require('multer');
const controller = require('../controllers/posts_controller');
const middleware = require('../middlewares/middleware');

const storage = multer.diskStorage({
    filename: function(req,file,callback){
        callback(null, Date.now()+file.originalname);
    }
});

// check if image files
const imageFilter = function(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/i)){
        return cb(new Error('Only image files are allowed'),false);
    }
    cb(null,true);
};

const upload = multer({ storage:storage, fileFilter: imageFilter});

route.get('/get_all_posts',middleware.authorization, controller.get_all_posts);

route.get('/get_my_posts/:id', middleware.authorization, controller.get_my_posts);

route.post('/create_post/:id', middleware.authorization, upload.single('image'), controller.create_post);
route.post('/delete_post/:id', middleware.authorization, controller.delete_post);

route.post('/like_post', middleware.authorization, controller.like_post);
route.post('/unlike_post', middleware.authorization, controller.unlike_post);

route.post('/tag_users/:id', middleware.authorization, controller.tag_users);

route.post('/make_comment/:id', middleware.authorization, controller.make_comment);
route.post('/delete_comment_by_post_owner/:id', middleware.authorization, controller.delete_comment_by_post_owner);
route.post('/delete_comment_by_comment_creater/:id', middleware.authorization,controller.delete_comment_by_comment_creater);

route.post('/:postId/comments/:commentId/reply', middleware.authorization,controller.reply_to_comment);


module.exports = route;
