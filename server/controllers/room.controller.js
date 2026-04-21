import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";
import cloudinary from "../configs/cloudinary.js";

//api to create a new room for hotel
export const createRoom = async (req, res) => {
    try {
        const {roomType, pricePerNight, amenities} = req.body;
        const hotel = await Hotel.findOne({owner: req.auth.userid});
        if(!hotel){
            return res.json({success: false, error: "Hotel not found"});
        }

        //upload images to cloudinary
        const uploadImage = req.files.map(async(file) => {
            const response = await cloudinary.uploader.upload(file.path);
            return response.secure_url;
        })

        //wait for all uploads to complete
        const Images = await Promise.all(uploadImage);

        await Room.create({
            hotel: hotel._id,
            roomType,
            pricePerNight: +pricePerNight,
            amenities: JSON.parse(amenities),
            images: Images
        })
        res.json({success: true, message: "Room created successfully"});
    } catch (error) {
        console.error("Create room error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}

//api to get all rooms of a hotel
export const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find({isAvailable: true}).populate({
            path: "hotel",
            populate: {
                path: "owner",
                select: "image"
            }
        }).sort({createdAt: -1})
        res.json({success: true, rooms});
    } catch (error) {
        console.error("Get rooms error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}

//api tp get all room for a specific hotel
export const getOwnerRooms = async (req, res) => {
    try {
        const hotelData = await Hotel({owner: req.auth.userId})
        const rooms = await Room.find({hotel: hotelData._id.toString()}).populate("hotel")
        res.json({success: true, rooms})
    } catch (error) {
        console.error("Get hotel rooms error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}

//api to toggle availability of a room
export const toggleRoomAvailability = async (req, res) => {
    try {
        const {roomId} = req.body;
        const roomData = await Room.findById(roomId);
        roomData.isAvailable = !roomData.isAvailable;
        await roomData.save();
        res.json({success: true, message: "Room availability toggled successfully"});
    } catch (error) {
        console.error("Toggle availability error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}