import User from "../models/user.model.js";

//middleware to check if user is authenticated
export const protect = async (req, res, next) => {
    const {userId} = req.body;
    if(!userId){
        return res.json({success: false, error: "Unauthorized"});
    }
    const user = await User.findById(userId);
    req.user = user;
    next();
}