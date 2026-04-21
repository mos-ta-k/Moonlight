import express from "express";
import upload from "../middlewares/upload.middleware.js";
import { createRoom, getRooms, getOwnerRooms, toggleRoomAvailability } from "../controllers/room.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const roomRouter = express.Router();

roomRouter.post("/create", protect, upload.array("images",4), createRoom);
roomRouter.get("/", getRooms);
roomRouter.get("/owner", protect, getOwnerRooms);
roomRouter.post("/toggle-availability", protect, toggleRoomAvailability);



export default roomRouter;