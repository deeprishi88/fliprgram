const User = require('../models/schema');
const UserServices = require('../services/service');

// get user friends
exports.getmyfriends = async(req,res) => {
    try{
        const data = await UserServices.friendlist(req.body.username);
        if(!data.success){
            return res.status(409).send(data.message);
        }
        return res.status(200).json({success: true, data: data.friends});
    } catch(e) {
        return res.status(400).json({ message: e.message });
    }
}

// send a request
exports.sendrequest = async(req,res) => {
    const { sender, receiver } = req.body;
    try{
        const data = await UserServices.sendrequest(sender,receiver);
        if(!data.success){
            return res.status(409).send(data.message);
        }
        return res.status(200).json({success: true, message: data.message});
    } catch(e) {
        return res.status(404).send(e.message);
    }
}

// accept request
exports.acceptrequest = async(req,res) => {
    const { sender, receiver } = req.body;
    try{
        const data = await UserServices.acceptrequest(sender,receiver);
        if(!data.success){
            return res.status(409).send(data.message);
        }
        return res.status(200).json({success: true, message: data.message});
    } catch(e) {
        return res.status(404).send(e.message);
    }
}

// reject request
exports.rejectrequest = async(req,res) => {
    const { sender, receiver } = req.body;
    try{
        const data = await UserServices.rejectrequest(sender,receiver);
        if(!data.success){
            return res.status(409).send(data.message);
        }
        return res.status(200).json({success: true, message: data.message});
    } catch(e) {
        return res.status(404).send(e.message);
    }
}

// removes friend from friend list of currentuser
exports.removefriend = async(req,res) => {
    const { currentuser, friend } = req.body;
    try{
        const data = await UserServices.removefriend(currentuser,friend);
        if(!data.success){
            return res.status(409).send(data.message);
        }
        return res.status(200).json({success: true, message: data.message});
    } catch(e) {
        return res.status(404).send(e.message);
    }
}

// blocks seconduser for the currentuser
exports.block = async(req,res) => {
    const { currentuser, seconduser } = req.body;
    try{
        const data = await UserServices.blocked(currentuser,seconduser);
        if(!data.success){
            return res.status(409).send(data.message);
        }
        return res.status(200).json({success: true, message: data.message});
    } catch(e) {
        return res.status(404).send(e.message);
    }
}
