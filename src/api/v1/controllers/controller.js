const User = require('../models/schema');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../helpers/auth');
const UserServices = require('../services/service');
//const db = require('../database/databases');
//const services = require('../services/service');

exports.ping = async(req,res) => {
    await res.sendStatus(200);
}

exports.signup = async (req,res) => {
    const data = req.body;
    const db = mongoose.connection;
    db.on('error',()=>console.log("Error in Connecting to Database"));
    db.once('open',()=>console.log("Connected to Database"));
    const if_present = await User.findOne({
        $or: [{ email: data.email}, {username: data.username}]
    });
    console.log(if_present);
    if(if_present){
        return res.sendStatus(409).send({ error: "User already present"});
    }
    try {
        const hash = await bcrypt.hash(data.hash, 10);

        const date = new Date();
        const user = new User({
            username: data.username,
            email: data.email,
            hash: hash,
            created_at: date,
            updated_at: date
        });

        await user.save();
        res.send(user);
    } catch(e) {
        res.sendStatus(400).send(e.message);
    }
}

exports.login = async(req,res) =>{
    const data = req.body;
    if (!data.password) {
        return res.status(400).send({ message: "password is required" });
    }
    if (!data.username) {
        return res
            .status(400)
            .send({ message: "Either Email or Password is required" });
    }
    try {
        const user = await User.findOne({username: data.username});
        if (!user) {
            res.status(401).send(invalid);
        }
        console.log(user);
        const passmatch = bcrypt.compare(data.password,user.password, function(err,result) {});
        if(!passmatch){
            res.status(401).send("Invalid Password");
        }
        const token = auth.newToken(user);
        res.sendStatus(200).send({ token });
    } catch(e) {
        console.error(e);
        res.status(500).end();
    }
}

exports.finduserbyusername = async (req,res) => {
    try{
        const { id } = req.params;
        if(!id){
            req.sendStatus(400).send("Invalid");
        }
        const record = await UserServices.findOneByUsername(id);
        if(!record){
            res.status(404).send("No User Exists");
        } 
        return res.status(200).json({
            ...record._doc
        });
    } catch(e) {
        return res.status(500).json({ message: e.message });
    }
}

exports.search = async (req,res) => {
    const { searchBy, searchValue, limit } = req.body;
    if (!searchBy || !searchValue) {
        return res
            .status(404)
            .json({ message: "searchBy and searchValue are required" });
    }
    //const ignoreList = req.user.blockedBy;
    try {
        const results = await UserServices.search(
            searchBy,
            searchValue,
            //ignorelist,
            limit
        );
        res.status(200).json(results);
    } catch (e) {
        return res.status(500).json([]);
    }
}
