const route = require('express').Router();
const multer = require('multer');
const controller = require('../controllers/media_controller');
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

route.post('/uploadprofilepic/:id', middleware.authorization, upload.single('image'), controller.uploadprofilepic);

route.post('/deleteprofilepic/:id', middleware.authorization, controller.deleteprofilepic);

module.exports = route;