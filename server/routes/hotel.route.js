import express from "express";
import { registerHotel } from "../controllers/hotel.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const hotelRouter = express.Router();

hotelRouter.post("/register", protect, registerHotel);

export default hotelRouter;