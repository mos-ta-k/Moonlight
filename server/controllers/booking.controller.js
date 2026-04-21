// function to check availability of room

import Room from "../models/room.model.js";
import Booking from "../models/booking.model.js";

const checkAvailability = async (req, res) => {
    const {checkInDate, checkOutDate, room} = req.body;
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: {$lte: checkInDate},
            checkOutDate: {$gte: checkOutDate}
        });
        const isAvailable = bookings.length === 0;
        return isAvailable;
    } catch (error) {
        console.error("Check availability error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}

//api to check availability of room
//POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
    try {
        const {checkInDate, checkOutDate, room} = req.body;
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        res.json({success: true, isAvailable});
    } catch (error) {
        console.error("Check availability error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}

//api to create a new booking
//POST /api/bookings/book
export const createBooking = async (req, res) => {
    try {
        const {checkInDate, checkOutDate, guest}= req.body;
        const user = req.user._id;

        //before booking chekc availability
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        if(!isAvailable){
            return res.json({success: false, error: "Room is not available"});
        }

        //get total price of room
        const roomData = await Room.findById(room).populate("hotel");
        let totalPrice = roomData.pricePerNight;

        //calculate total price based on nights
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        totalPrice = totalPrice * nights;

        //create booking
        await Booking.create({
            user,
            room,
            hotel: roomData.hotel._id,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice
        });
        res.json({success: true, message: "Booking created successfully"});

    } catch (error) {
        console.error("Create booking error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
};

// api to get all bookings of a user
//GET /api/bookings/user
export const getUserBookings = async (req, res) => {
    try {
        const user = req.user._id;
        const bookings = await (await Booking.find({user}).populate("room hotel")).sort({createdAt: -1});
        res.json({success: true, bookings});
    } catch (error) {
        console.error("Get user bookings error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
};  

export const getHotelBookings = async (req, res) => {
    try{
        const hotel = await Hotel.findOne({owner: req.user._id});
        if(!hotel){
            return res.json({success: false, error: "Hotel not found"});
        }
        const bookings = await Booking.find({hotel: hotel._id}).populate("room user").sort({createdAt: -1});
        
        //total Bookings 
        const totalBookings = bookings.length;
        
        //total reve
        const totalRevenue = bookings.reduce((acc, booking)=> acc + booking.totalPrice, 0)
        res.json({success: true, dashboardData: {totalBookings, totalRevenue, bookings}});
    }
    catch(error){
        console.error("Get hotel bookings error:", error.message);
        res.json({success: false, error: "Internal server error"});
    }
}