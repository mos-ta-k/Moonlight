const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database connected!"));
        mongoose.connection.on('error', (err) => console.error("Mongoose error:", err));
        await mongoose.connect(`${process.env.MONGODB_URI}/moonlight`);
    } catch (error) {
        console.error("ConnectDB failed:", error.message);
    }
};