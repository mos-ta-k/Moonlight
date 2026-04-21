import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import "dotenv/config";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";

const app = express();

// Middleware
app.use(cors());

//middleware
app.use(express.json());
app.use(clerkMiddleware());

//api to listen clerk webhooks
app.post("/api/clerk", clerkWebhooks);

// Connect to database
connectDB();

// Routes
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});