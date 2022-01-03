const User = require('../models/schema');

async function findOneByUsername(username) {
    return await User.findOne({ username }).exec();
}

async function findOneById(id) {
    return await User.findById(id).lean().exec();
}

async function search(searchBy, searchValue, limit) {
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

module.exports = {
    findOneByUsername,
    findOneById,
    search
};

