import mongoose, { Schema } from "mongoose";

const eventSchema = mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String,
    },
    hotel: {
        type: String,
    },
    date: {
        type: Date,
    },
    capacity: {
        type: Number,
    },
    imgUrl: {
        type: String
    },
    price: {
        type: Schema.Types.Number,
        required: true,
        min: 0.01
    },
    estado:{
        type: Boolean,
        default: true
    }
})

export default mongoose.model('Event', eventSchema)