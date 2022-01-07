const User = require('../models/schema');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const auth = require('../helpers/auth');
const UserServices = require('../services/service');
const FetchService = require('../services/fetch_service');
const {
    emailValidator,
    passwordValidator,
    usernameValidator,
    verificationCodeValidator,
} = require("../validators/validator");

exports.ping = async(req,res) => {
    await res.sendStatus(200);
}

exports.signup = async (req,res) => {
        const data = req.body;
        const if_present = await User.findOne({
            $or: [{ email: data.email}, {username: data.username}]
        });
        console.log(if_present);
        if(if_present){
            return res.sendStatus(409).send({ error: "User already present"});
        }
        try{
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
            const eventname = "verificationemail"
            //console.log(eventname);
            UserServices.createVerificationEmailEntry(
                user.email,
                eventname,
                user._id,
                user.username,
            );
            res.status(200).send("Verification Code sent and user registered");
    } catch(e) {
        res.sendStatus(400).send(e.message);
    }
}

exports.login = async(req,res) =>{
    const data = req.body;
    if (!data.hash) {
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
            res.status(401).send("invalid data");
        }
        console.log(user);
        const passmatch = await bcrypt.compare(data.hash,user.hash);
        if(!passmatch){
            res.status(401).send("Invalid Password");
        }
        const token = auth.newToken(user);
        res.status(200).send(token);
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
        //console.log(record);
        return res.status(200).json({
            username: record.username,
            email: record.email
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
    try {
        const results = await UserServices.search(
            searchBy,
            searchValue,
            limit
        );
        res.status(200).json(results);
    } catch (e) {
        return res.status(500).json([]);
    }
}


exports.verifyEmailLink = async (req, res) => {
    try {
        let { id } = req.params;
        if (!verificationCodeValidator(id)) {
            return res.status(404).send();
        }
        let doc = await FetchService.getEmailEntryBycodeRequest(id);
        if (!doc || !doc.success) return res.status(404).send();

        if (doc.data.eventName === "verificationemail") {
            await UserServices.changeAccountStateVerified(
                doc.data.associatedUser,
            );
            return res.status(202).json({ message: "User is now verified" });
        }
        return res.status(404).send();
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};

exports.updateCurrentUser = async (req, res) => {
    try {
        const update = {};
        [
            "username",
            "password",
            "phoneNumber",
            "profileStatus",
            "Notification",
        ].forEach((element) => {
            if (req.body[element]) {
                update[element] = req.body[element];
            }
        });
        await UserServices.findByIdAndUpdate(req.user._id, update);

        return res.status(204).send();
    } catch (e) {
        return res.status(400).json({ message: e.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email || !emailValidator(email))
            return res.status(404).json({ message: "Invalid Email" });
        const user = await UserServices.findOneByEmail(email);
        if (!user)
            return res
                .status(404)
                .json({ message: "No user found for this Email" });
        
        const event = "forgotpasswordemail"
        UserServices.createVerificationEmailEntry(
            email,
            event,
            user.id,
            user.username,
        );
        return res.status(200).json({
            message: `Verification code is sent on your email to update password`,
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
exports.updatePassword = async (req, res) => {
    try {
        const { code, password } = req.body;
        if (!verificationCodeValidator(code)) {
            return res.status(400).json({ message: "invalid Code" });
        }
        if (!passwordValidator(password)) {
            return res.status(400).json({ message: "Weak Password Sent" });
        }

        const doc = await FetchService.getEmailEntryBycodeRequest(code);
        if (doc && doc.success) {
            if (doc.data.eventName === "forgotpasswordemail") {
                const id = doc.data.associatedUser;
                const user = await UserServices.findByIdAndUpdate(id, {
                    password,
                });
                if (user) {
                    return res.status(202).end();
                }
            }
        }
        return res.status(404).json({ message: "Code Expired" });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
};
exports.getUserProfile = async (req, res) => {
    return res.json(req.user);
};