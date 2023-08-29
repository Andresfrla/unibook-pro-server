const Admin = require("../models/Admin.model")

exports.isAdmin = async (req, res, next) => {
    const { _id: adminId } = req.payload;

    const adminInDB = await Admin.findById(adminId)

    if(!adminInDB){
        res.status(403).json({message: `Forbidden access you don't have access`})
        return
    }
    next();
}