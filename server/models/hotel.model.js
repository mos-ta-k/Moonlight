import mongoos from "mongoose";

const hotelSchema = new mongoos.Schema({
    name:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    city:{
        type: String,
        required: true
    },
    contact:{
        type: String,
        required: true
    },
    owner:{
        type: String,
        required: true
    }
}, {timestamps: true})

const Hotel = mongoos.model("Hotel", hotelSchema);

export default Hotel;
