// function to check availability of room

import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";
import Booking from "../models/booking.model.js";

// Internal helper — returns a boolean
const checkAvailability = async ({checkInDate, checkOutDate, room}) => {
    try {
        // Find any booking that overlaps with the requested dates
        const bookings = await Booking.find({
            room,
            checkInDate: { $lt: new Date(checkOutDate) },
            checkOutDate: { $gt: new Date(checkInDate) }
        });
        return bookings.length === 0;
    } catch (error) {
        console.error("Check availability error:", error.message);
        return false;
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
        const {room, checkInDate, checkOutDate, guests, paymentMethod} = req.body;
        const user = req.user._id;

        //before booking check availability
        const isAvailable = await checkAvailability({checkInDate, checkOutDate, room});
        if(!isAvailable){
            return res.json({success: false, message: "Room is not available for selected dates"});
        }

        //get total price of room
        const roomData = await Room.findById(room).populate("hotel");
        if(!roomData) return res.json({success: false, message: "Room not found"});

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
            totalPrice,
            paymentMethod: paymentMethod || 'Pay at hotel'
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

        const bookings = await Booking.find({ user })
            .populate("room hotel")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });

    } catch (error) {
        console.error("Get user bookings error:", error.message);
        res.json({ success: false, error: "Internal server error" });
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

