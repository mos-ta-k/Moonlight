import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.json({ success: false, error: "Unauthorized - Not logged in" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, error: "User not found in DB" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        return res.json({ success: false, error: "Unauthorized" });
    }
};