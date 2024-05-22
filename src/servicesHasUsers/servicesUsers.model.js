import mongoose, { Schema } from "mongoose";

const servicesSchema = mongoose.Schema({
    service: {
        type: String,
        required: true
    },
    hotel: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    reservations: [{
        starDate: {
            type: Date
        },
        endDate: {
            type: Date
        }
    }],
    extra:{
        type: String
    },
    total:{
        type: Number,
    },
    estado:{
        type: Boolean,
        default: true
    }
})

export default mongoose.model('Services', servicesSchema)