const User = require('../models/schema');
const UserServices = require('../services/service');
//const FetchService = require('../services/fetch_service');

exports.getmyfriends = async(req,res) => {
    try{
        const data = UserServices.friendlist(req.body.username);
        if(!data.success){
            res.status(409).send(data.message);
        }
        res.status(200).json({success: true, friends: data.friends});
    } catch(e) {
        return res.status(400).json({ message: e.message });
    }
}

exports.sendrequest = async(req,res) => {
    const { sender, receiver } = req.body;
    try{
        const data = UserServices.sendrequest(sender,receiver);
        if(!data.success){
            res.status(409).send(data.message);
        }
        res.status(200).json({success: true, message: data.message});
    } catch(e) {
        res.status(404).send(e.message);
    }
}

exports.acceptrequest = async(req,res) => {
    const { sender, receiver } = req.body;
    try{
        const data = UserServices.acceptrequest(sender,receiver);
        if(!data.success){
            res.status(409).send(data.message);
        }
        res.status(200).json({success: true, message: data.message});
    } catch(e) {
        res.status(404).send(e.message);
    }
}

exports.rejectrequest = async(req,res) => {
    const { sender, receiver } = req.body;
    try{
        const data = UserServices.rejectrequest(sender,receiver);
        if(!data.success){
            res.status(409).send(data.message);
        }
        res.status(200).json({success: true, message: data.message});
    } catch(e) {
        res.status(404).send(e.message);
    }
}

exports.removefriend = async(req,res) => {
    const { currentuser, friend } = req.body;
    try{
        const data = UserServices.removefriend(currentuser,friend);
        if(!data.success){
            res.status(409).send(data.message);
        }
        res.status(200).json({success: true, message: data.message});
    } catch(e) {
        res.status(404).send(e.message);
    }
}

exports.block = async(req,res) => {
    const { currentuser, seconduser } = req.body;
    try{
        const data = UserServices.blocked(currentuser,seconduser);
        if(!data.success){
            res.status(409).send(data.message);
        }
        res.status(200).json({success: true, message: data.message});
    } catch(e) {
        res.status(404).send(e.message);
    }
}