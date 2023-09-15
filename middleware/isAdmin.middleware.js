const User = require("../models/User.model");

exports.isAdmin = async (req, res, next) => {
    const { _id: userId } = req.payload;

    const userInDB = await User.findById(userId);

    if (!userInDB || userInDB.role !== 'admin') {
        res.status(403).json({message: "Forbidden access: you don't have access"});
        return;
    }

    next();
};
