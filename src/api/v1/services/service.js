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
};

