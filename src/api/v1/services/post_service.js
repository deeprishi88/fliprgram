const User = require('../models/schema');
const posts = require('../models/posts_schema');
const comment = require('../models/comment_schema');

exports.getFeeds = async (userId, pagenumber, pagesize) => {
    const skip = (pagenumber - 1) * pagesize;
    const user = User.findById(userId).exec();

    const post = await posts.find()
        .sort({
            createdAt: 1,
        })
        .skip(skip)
        .limit(pagesize)
        .populate({
            path: "comments",
            options: { perDocumentLimit: 5 },
            select: {
                text: 1,
                creater_id: 1,
                post_id: 1
            },
        });
        return post;
}