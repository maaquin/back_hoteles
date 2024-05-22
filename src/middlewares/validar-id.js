import mongoose from 'mongoose';

export const validarHotelId = (req, res, next) => {
    const { hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
        return res.status(400).json({
        });
    }

    if(hotelId === null){
        return res.status(400).json({
        });
    }

    next();
};