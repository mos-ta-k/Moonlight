import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["hotelOwner", "user"],
        default: "user"
    },
    image:{
        type: String
    },
    recentSearchedCities:{
        type: String,
        default: ""
    }
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;