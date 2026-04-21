import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";

//add hotel
export const registerHotel = async (req, res) => {
    try {
        const {name, address, city, contact} = req.body;
        const owner = req.user._id;

        //check if the user is alredy regiestered as hotel owner
        const hotel = await Hotel.findOne({owner});
        if(hotel){
            return res.json({success: false, error: "You are already registered as a hotel owner"});
        }
        //register hotel
        await Hotel.create({name, address, city, contact, owner});
        await User.findByIdAndUpdate(owner, {role: "hotelOwner"});
        res.json({success: true, message: "Hotel added successfully"});
    } catch (error) {
        console.error("Add hotel error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}