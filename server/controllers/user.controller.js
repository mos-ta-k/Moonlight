import User from "../models/user.model.js";
//GET /api/user

export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchedCities = req.user.recentSearchedCities;
        res.json({success: true, role, recentSearchedCities});
    } catch (error) {
        console.error("Get user data error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}

//store user recent searched cities
export const storeRecentSearchedCities = async (req, res) => {
    try {
        const {recentSearchedCities} = req.body;
        const user = await User.findById(req.user._id);

        if(user.recentSearchedCities.length < 3){
            user.recentSearchedCities.push(recentSearchedCities);
        }
        else{
            user.recentSearchedCities.shift();
            user.recentSearchedCities.push(recentSearchedCities);
        }
        await user.save();
        res.json({success: true, message: "Recent searched cities stored successfully"});
    } catch (error) {
        console.error("Store recent searched cities error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}