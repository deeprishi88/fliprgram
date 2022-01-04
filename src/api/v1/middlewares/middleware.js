const { verifyToken } = require('../helpers/auth');
const UserService = require('../services/service');
const { tokenValidator } = require('../validators/validator');


exports.authorization = async (req, res, next) => {
    const bearer = req.headers.authorization;

    if (!bearer || !bearer.startsWith("Bearer ")) {
        return res.status(401).end();
    }

    const token = bearer.split("Bearer ")[1].trim();
    if (!tokenValidator(token)) return res.status(401).end();
    let payload;
    try {
        payload = await verifyToken(token);
    } catch (e) {
        return res.status(401).end();
    }

    const user = await UserService.findOneById(payload.id);

    if (!user) {
        return res.status(401).end();
    }

    req.user = user;
    next();
};