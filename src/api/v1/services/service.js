const User = require('../models/schema');
const { PORT } = require('../../../config/configs');
const fetchService = require("./fetch_service");

// find a usert by email
async function findOneByEmail(email) {
    return await User.findOne({ email }).exec();
}

// find user by username
async function findOneByUsername(username) {
    return await User.findOne({ username }).exec();
}

// find user either by email or username
async function findOnebyEmailorUsername(username, email) {
    return await User.findOne({ $or: [{ email }, { username }] }).exec();
}


// find user by id
async function findOneById(id) {
    return await User.findById(id).lean().exec();
}


// find the user by id and upfate its data
async function findByIdAndUpdate(id, data) {
    let doc = await User.findByIdAndUpdate(id, data, {
        new: true,
    }).exec();
    return doc;
}

// search users
async function search(searchBy, searchValue, ignoreList, limit) {
    const allowedSearches = ["username", "email", "name"];
    let filter = {};
    if (allowedSearches.includes(searchBy)) {
        filter = {
            [searchBy]: { $regex: searchValue, $options: "i" },
            _id: { $nin: ignoreList },
            profileStatus: { $ne: "private" },
            verifiedUser: { $ne: "false" },
        };
        const results = await User.find(filter)
            .limit(limit || 100)
            .select("email username name")
            .exec();
        return results;
    }
    return [];
}


// checks whether the account is verified 
async function changeAccountStateVerified(id) {
    let doc = await User.findById(id).exec();
    if (!doc) {
        throw new Error("Record not Found");
    }
    doc.verifiedUser = true;
    await doc.save();
    return true;
}


// creates an email entry request
async function createVerificationEmailEntry(
    email,
    eventName,
    userId,
    username,
) {
    try {
        //console.log('hdfg');
        let res = await fetchService.createEmailEntryRequest(
            email,
            eventName,
            userId,
            username,
        );
        if (res.success && res.data.verificationCode) {
            return res.data.verificationCode;
        }
        return false;
    } catch (e) {
        return false;
    }
}

// sends the verification email
async function sendVerificationEmail(email, username, code) {
    try {
        let message = `
        You are just one step behind to activate your account and get most out of it 
        Please click the link below to confirm your account creation with username ${username}
        http://localhost:${PORT}/api/v1/users/${code}
        `;
        let res = await fetchService.sendEmailrequest(
            email,
            "Verification Link for Account",
            message,
        );
        if (res.success && res.data.verificationCode) {
            return res;
        }
        return false;
    } catch (e) {
        return false;
    }
}

async function friendlist(username) {
    try {
        const user = await User.findOne({username: username})
        .populate('friends')
        .exec();

        return {
            success: true,
            message: 'friend list received',
            friends: user.friends
        };
    } catch(e) {
        return {
            success: false,
            message: e.message
        };
    }
}

async function sendrequest(sender, receiver){
    try {
        const ifsender = User.findOne({username: sender}).exec();
        if(!ifsender){
            return {
                success: false,
                message: 'invalid sender username'
            };
        }
        const ifreceiver = User.findOne({username: receiver}).exec();
        if(!ifreceiver){
            return {
                success: false,
                message: 'invalid receiver username'
            };
        }
        if(ifreceiver.blocklist.includes(ifsender.username)){
            return {
                success: false,
                message: 'Receiver have blocked you'
            };
        }
        if(ifsender.friends.includes(ifreceiver.username)){
            return {
                success: false,
                message: 'Receiver already your friend'
            };
        }
        if(ifsender.sentrequests.includes(ifreceiver.username)){
            return {
                success: false,
                message: 'Request already sent'
            };
        }
        ifsender.sentrequests.addToSet(ifreceiver.username);
        ifreceiver.receiverequests.addToSet(ifsender.username);
        await Promise.all([ifsender.save(), ifreceiver.save()]);
        return {
            success: true,
            message: 'Request sent successfully'
        };
    } catch(e){
        return {
            success: false,
            message: e.message
        }
    }
}

async function acceptrequest(sender, receiver) {
    try {
        const ifsender = User.findOne({username: sender}).exec();
        if(!ifsender){
            return {
                success: false,
                message: 'invalid sender username provided'
            };
        }
        const ifreceiver = User.findOne({username: receiver}).exec();
        if(!ifreceiver){
            return {
                success: false,
                message: 'invalid receiver username provided'
            };
        }
        if(ifsender.friends.includes(ifreceiver.username)){
            return {
                success: false,
                message: 'Sender already a friend of receiver'
            }
        }
        if(!ifreceiver.receiverequests.includes(ifsender.username)){
            return {
                success: false,
                message: 'Request not yet sent to receiver by sender'
            }
        }
        ifsender.sentrequests.pull(ifreceiver.username);
        ifreceiver.receiverequests.pull(ifsender.username);
        ifsender.friends.addToSet(ifreceiver.username);
        ifreceiver.friends.addToSet(ifsender.username);
        await Promise.all([ifsender.save(), ifreceiver.save()]);
        return {
            success: true,
            message: 'Request accepted successfully'
        };
    } catch(e) {
        return {
            success: false,
            message: e.message
        }
    }
}

async function rejectrequest(sender, receiver) {
    try {
        const ifsender = User.findOne({username: sender}).exec();
        if(!ifsender){
            return {
                success: false,
                message: 'invalid sender username provided'
            };
        }
        const ifreceiver = User.findOne({username: receiver}).exec();
        if(!ifreceiver){
            return {
                success: false,
                message: 'invalid receiver username provided'
            };
        }
        if(ifsender.friends.includes(ifreceiver.username)){
            return {
                success: false,
                message: 'Sender already a friend of receiver'
            }
        }
        if(!ifreceiver.receiverequests.includes(ifsender.username)){
            return {
                success: false,
                message: 'Request not yet sent to receiver by sender'
            }
        }
        ifsender.sentrequests.pull(ifreceiver.username);
        ifreceiver.receiverequests.pull(ifsender.username);
        await Promise.all([ifsender.save(), ifreceiver.save()]);
        return {
            success: true,
            message: 'Request rejected successfully'
        };
    } catch(e) {
        return {
            success: false,
            message: e.message
        }
    }
}

async function removefriend(currentuser, friend){
    try{
        const ifcurrentuser = User.findOne({username: currentuser}).exec();
        if(!ifcurrentuser){
            return {
                success: false,
                message: 'invalid current username provided'
            };
        }
        const iffriend = User.findOne({username: friend}).exec();
        if(!iffriend){
            return {
                success: false,
                message: 'invalid friend username provided'
            };
        }
        if(!ifcurrentuser.friends.includes(friend)){
            return {
                success: false,
                message: 'Already not in friends list of user'
            };
        }
        ifcurrentuser.friends.pull(friend);
        iffriend.friends.pull(currentuser);
        await Promise.all([ifcurrentuser.save(), iffriend.save()]);
        return {
            success: true,
            message: `${friend} removed as your friend`
        }
    } catch(e) {
        return {
            success: false,
            message: e.message
        }
    }
}

async function blocked(currentuser,seconduser){
    try {
        const ifcurrentuser = User.findOne({username: currentuser}).exec();
        if(!ifcurrentuser){
            return {
                success: false,
                message: 'invalid current username provided'
            };
        }
        const ifseconduser = User.findOne({username: seconduser}).exec();
        if(!ifseconduser){
            return {
                success: false,
                message: 'invalid second username provided'
            };
        }
        if(ifcurrentuser.blocklist.includes(seconduser)){
            return {
                success: false,
                message: 'Second user already blocked'
            };
        }
        if(ifcurrentuser.friends.includes(seconduser)){
            ifcurrentuser.friends.pull(seconduser);
            ifseconduser.friends.pull(currentuser);
        }
        ifcurrentuser.blocklist.addToSet(seconduser);
        await Promise.all([ifcurrentuser.save(), ifseconduser.save()]);
        return {
            success: true,
            message: `${seconduser} blocked successfully`
        };
    } catch(e) {
        return {
            success: false,
            message: e.message
        }
    }
}

module.exports = {
    findOneById,
    findOneByEmail,
    findOneByUsername,
    findOnebyEmailorUsername,
    findByIdAndUpdate,
    search,
    changeAccountStateVerified,
    createVerificationEmailEntry,
    sendVerificationEmail,
    friendlist,
    sendrequest,
    acceptrequest,
    rejectrequest,
    removefriend,
    blocked,
};

