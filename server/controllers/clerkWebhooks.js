import mongoose from "mongoose";
import { Webhook } from "svix";
import connectDB from "../configs/db.js";
import User from "../models/user.model.js";

const clerkWebhooks = async (req, res) => {
  try {
    // Reconnect if cold start killed the connection
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    if (!process.env.CLERK_WEBHOOK_SECRET) {
      return res
        .status(500)
        .json({ success: false, error: "Webhook secret not configured" });
    }

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    const payload = req.body.toString("utf8");
    await whook.verify(payload, headers);

    const { data, type } = JSON.parse(payload);

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address,
      username:
        `${data.first_name || ""}${data.last_name ? " " + data.last_name : ""}`.trim() ||
        "Unknown",
      image: data.image_url,
    };

    switch (type) {
      case "user.created":
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address,
          username:
            `${data.first_name || ""}${data.last_name ? " " + data.last_name : ""}`.trim() ||
            "Unknown",
          image: data.image_url,
        };
        await User.create(userData);
        break;
      case "user.updated":
        const userData = {
          _id: data.id,
          email: data.email_addresses?.[0]?.email_address,
          username:
            `${data.first_name || ""}${data.last_name ? " " + data.last_name : ""}`.trim() ||
            "Unknown",
          image: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData, { new: true });
        break;
      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        break;
      default:
        break;
    }

    res.json({ success: true, message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(400).json({ success: false, error: error.message });
  }
};

export default clerkWebhooks;
