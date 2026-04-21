import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("MONGODB_URI:", process.env.MONGODB_URI ? "is set" : "UNDEFINED!");
        mongoose.connection.on('connected', () => console.log("Database connected!"));
        await mongoose.connect(`${process.env.MONGODB_URI}/moonlight`);
    } catch (error) {
        console.error("ConnectDB failed:", error.message);
    }
};
export default connectDB;