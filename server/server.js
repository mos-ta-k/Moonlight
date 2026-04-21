import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/user.route.js";
import hotelRouter from "./routes/hotel.route.js";
import roomRouter from "./routes/room.route.js";
import connectCloudinary from "./configs/cloudinary.js";

const app = express();

// Middleware
app.use(cors());

//api to listen clerk webhooks BEFORE express.json() parses the body
app.post("/api/clerk", express.raw({ type: 'application/json' }), clerkWebhooks);

//middleware
app.use(express.json());
app.use(clerkMiddleware());

// Connect to database
connectDB();
connectCloudinary();

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});
app.use("/api/user", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/rooms", roomRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});