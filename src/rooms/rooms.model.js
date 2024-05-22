import mongoose, { Schema } from "mongoose";

const roomSchema = mongoose.Schema({
    hotel: {
        type: Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true
    },
    name: {
        type: String,
        default: 'none',
    },
    available: {
        type: Boolean,
        default: true
    },
    price: {
        type: Schema.Types.Number,
        required: true,
        min: 0.01
    },
    capacity: {
        type: Number,
    },
    imgUrl: {
        type: String,
        default: 'none'
    },
    estado:{
        type: Boolean,
        default: true
    }
})

export default mongoose.model('Room', roomSchema)