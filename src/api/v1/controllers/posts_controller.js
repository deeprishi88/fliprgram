const User = require('../models/schema');
const posts_user = require('../models/posts_schema');
const posts_comment = require('../models/comment_schema');
const cloudinary = require('../../../config/cloudinary');
const UserServices = require('../services/service');
const PostService = require('../services/post_service');

exports.get_all_posts = async(req,res) => {
    try {
        let { pagenumber, pagesize } = req.query;
        pagenumber = parseInt(pagenumber);
        pagesize = parseInt(pagesize);
        if (
            !pagenumber ||
            !pagesize ||
            Number.isNaN(pagesize) ||
            Number.isNaN(pagenumber)
        ) {
            return res.status(404).json({
                message: "pagenumber,pagesize are required",
            });
        }

        const posts = await PostService.getFeeds(
            pagenumber,
            pagesize,
        );
        return res.status(200).json(posts);
    } catch(e){
        return res.status(500).json({ message: e.message });
    }
}


exports.create_post = async(req,res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(409).send('Invalid User');
        }

        const data = await cloudinary.uploader.upload(req.file.path);
        const date = new Date();
        
        const user_posts = new posts_user({
            user_id : userId,
            post_image : data.secure_url,
            post_image_id : data.public_id,
            created_at : date
        });

        await user_posts.save();
        const posts_id = user_posts._id;
        await user.post_id.addToSet(posts_id);
        await user.save();
        console.log(user_posts);
        return res.status(200).send("Posted Successfully");
    } catch(e) {
        return res.status(500).send('Uploading failed');
    }
}

exports.delete_post = async(req,res) => {
    try {
        const userId = req.params.id;
        const postId = req.body.post_id;
        const user = await User.findById(userId);

        if(!user){
            return res.status(409).send('Invalid User');
        }

        const post_as_per_id = await posts_user.findById(postId);
        
        if(!post_as_per_id){
            return res.status(409).send('Invalid post id provided');
        }

        if(!user.post_id.includes(post_as_per_id)){
            return res.status(409).send('Post not associated with current user');
        }

        await posts_user.findByIdAndDelete(postId, function (err, post_as_per_id) {
            if (err){
                return res.status(409).send('Deletion failed');
            }
            else{
                console.log("Deleted : ", post_as_per_id);
            }
        });

        await user.post_id.pull(post_as_per_id);
        await user.save();

        return res.status(200).send('Post deleted successfully');
    } catch(e) {
        return res.status(500).send('Deletion failed');
    }
}

exports.like_post = async(req,res) => {
    try{
        const username = req.body.username;
        const postId = req.body.post_id;

        const currentuser = UserServices.findOneByUsername(username);
        if(!currentuser){
            return res.status(409).send('Invalid User');
        }

        const post = posts_user.findById(postId);
        if(!post){
            return res.status(409).send('Invalid post id provided');
        }

        await currentuser.liked_posts.addToSet(postId);

        await post.findOneAndUpdate({$inc : {'post.likes' : 1}});

        await currentuser.save();
        await post.save();

        return res.status(200).send('Post Successfully liked');
    } catch(e){
        return res.status(500).send('Some error occured');
    }
}

exports.unlike_post = async(req,res) => {
    try{
        const username = req.body.username;
        const postId = req.body.post_id;

        const currentuser = UserServices.findOneByUsername(username);
        if(!currentuser){
            return res.status(409).send('Invalid User');
        }

        const post = posts_user.findById(postId);
        if(!post){
            return res.status(409).send('Invalid post id provided');
        }

        if(!currentuser.liked_posts.includes(postId)){
            return res.status(409).send('User not liked the post')
        }
        await currentuser.liked_posts.pull(postId);

        await post.findOneAndUpdate({$dec : {'post.likes' : 1}});

        await currentuser.save();
        await post.save();

        return res.status(200).send('Post Successfully liked');
    } catch(e){
        return res.status(500).send('Some error occured');
    }
}

exports.tag_users = async(req,res) => {
    try{
        const userId = req.params.id;
        const postId = req.body.postId;
        const usernames_to_be_tagged = req.body.usernames;

        const post = posts_user.findById(postId);
        if(!post){
            return res.status(409).send('Invalid post id');
        }

        for(let i=0;i<usernames_to_be_tagged.length;i++){
            await posts_user.tagged_users.addToSet(usernames_to_be_tagged[i]);
        }
        await post.save();
        return res.status(200).send('Users tagged successfully');
    } catch(e) {
        return res.status(500).send('Some error occured');
    }
}

exports.get_my_posts = async(req,res) => {
    try {
        const userId = req.params.id;
        const user = User.findById(userId);
        if(!user){
            return res.status(409).send('Invalid user');
        }
        const post_pics = [];
        const post_pics_id = [];
        for(let i=0;i<user.post_id.length;i++){
            const post = await posts_user.findById(user.post_id[i]);
            await post_pics.addToSet(post.post_image);
            await post_pics_id.addToSet(post.post_image_id);
        }
        return res.status(200).json({message: 'all posts fetched successfully', post_pics : post_pics, post_pics_id : post_pics_id });
    } catch(e) {
        return res.status(500).send('Some error occured');
    }
}

exports.make_comment = async(req,res) => {
    try {
        const userId = req.params.id;
        const postId = req.body.postid;
        const text = req.body.text;
        const user = User.findById(userId);
        const post = posts_user.findById(postId);
        if(!post){
            return res.status(409).send('Invalid post');
        }

        const date = new Date();
        const comment = new posts_comment ({
            text : text,
            creater_id : userId,
            post_id : postId,
            created_at : date
        });
        await comment.save();

        const comment_id = comment._id;

        await post.comments.addToSet(comment_id);
        await user.comments_made.addToSet(comment_id);
        await post.save();
        await user.save();
        return res.status(200).send('Commented Sucessfully');
    } catch(e){
        return res.status(500).send('Some error occured');
    }
}

exports.delete_comment_by_post_owner = async(req,res) => {
    try {
        const post_owner_id = req.params.id;
        const post_owner = User.findById(post_owner_id);

        const comment_id = req.body.commentid;
        const comment = posts_comment.findById(comment_id);
        if(!comment){
            return res.status(409).send('Invalid comment');
        }

        const post_id = comment.post_id;
        const creater_id = comment.creater_id;

        const post = user_posts.findById(post_id);
        const creater = User.findById(creater_id);

        await posts_comment.findByIdAndDelete(comment_id, function(err,comment){
            if(err){
                return res.status(409).send('Invalid comment');
            }
            else{
                console.log('Comment deleted Successfully : ', comment);
            }
        });
        await post.comments.pull(comment_id);
        await creater.comments_made.pull(comment_id);
        
        await post.save();
        await creater.save();

        return res.status(200).send('Comment deleted Successfully');
    } catch(e) {
        return res.status(500).send('Some error occured');
    }
}

exports.delete_comment_by_comment_creater = async(req,res) => {
    try {
        const creater_id = req.params.id;
        const comment_id = req.body.commentid;

        const creater = User.findById(creater_id);
        const comment = posts_comment.findById(comment_id);

        if(!comment){
            return res.status(409).send('Invalid comment');
        }
        if(comment.creater_id != creater_id){
            return res.status(409).send('Specific comment not done by current user');
        }

        const post_id = comment.post_id;
        const post = user_posts.findById(post_id);

        await posts_comment.findByIdAndDelete(comment_id, function(err,comment){
            if(err){
                return res.status(409).send('Invalid comment');
            }
            else{
                console.log('Comment deleted Successfully : ', comment);
            }
        });

        await post.comments.pull(comment_id);
        await creater.comments_made.pull(comment_id);

        await post.save();
        await creater.save();

        return res.status(200).send('Comment deleted Successfully');
    } catch(e) {
        return res.status(500).send('Some error occured');
    }
}


