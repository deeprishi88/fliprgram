const User = require('../models/schema');
const cloudinary = require('../../../config/cloudinary');

// uploads the profile pic of user
exports.uploadprofilepic = async(req,res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user){
            throw new error('Invalid userId');
        }

        const data = await cloudinary.uploader.upload(req.file.path);

        user.profile_pic = data.secure_url;
        user.profile_pic_id = data.public_id;

        await user.save();
        return res.status(200).json({message: 'Image uploaded successfully', data: data });

    } catch(e) {
        return res.status(500).send('Uploading failed');
    }
}

// deletes the profile pic of user
exports.deleteprofilepic = async(req,res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        
        if(!user){
            throw new error('Invalid userId');
        }

        await cloudinary.uploader.destroy(user.profile_pic_id);
        return res.status(200).json({message: 'Image deleted successfully'});
    } catch(e) {
        return res.status(500).send('Deletion failed');
    }
}