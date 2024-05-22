import { response, request } from "express";
import bcryptjs from "bcryptjs";
import Room from './rooms.model.js';
import Hotel from '../hotels/hotels.model.js';
import mongoose from "mongoose";
import User from "../users/user.model.js";

// Crear Habitación
export const createRoom = async (req, res) => {
    const { hotel, name, price, capacity, imgUrl } = req.body;

    try {
        // Verificar si el hotel existe
        const existingHotel = await Hotel.findById(hotel);
        if (!existingHotel) {
            return res.status(404).json({ msg: 'Hotel not found' });
        }

        const hotelId = existingHotel._id; 

        const room = new Room({ hotel: hotelId, name, price, capacity, imgUrl });

        await room.save();
        res.status(200).json({
            room
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Debe proporcionar el ID del hotel' });
    }
}

// Buscar habitaciones
export const getRoom = async (req = request, res = response) => {
    const { limite, desde } = req.query;
    const query = { estado: true };

    try {
        const [total, rooms] = await Promise.all([
            Room.countDocuments(query),
            Room.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
                .populate('hotel', 'name')
                .exec()
        ]);

        res.status(200).json({
            total,
            rooms
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
}

export const getBadRoom = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findOne({ hotel: id, estado: false })
            .populate('hotel', 'name')
            .exec();
        if (!room) {
            return res.status(404).send('Room not found');
        }
        return res.status(200).json(room);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};



export const getRoomById = async (req, res) => {
    try {
        const { id } = req.params;
        const room = await Room.findById(id)
            .populate('hotel', 'name')
            .exec();
        if (!room) {
            return res.status(404).send('Room not found');
        }
        return res.status(200).json(room);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

// Buscar por nombre
export const getRoomByName = async (req, res = response) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ msg: 'El nombre de la habitación es obligatorio en la consulta' });
    }

    const query = { name: { $regex: new RegExp(name, 'i') } };

    try {
        const rooms = await Room.find(query);

        if (rooms.length === 0) {
            return res.status(404).json({ msg: 'Habitaciones no encontradas' });
        }

        res.status(200).json({ rooms });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al buscar las habitaciones por nombre' });
    }
}


export const getRoomsByHotelId = async (req, res) => {
    const { hotelId } = req.params;

    if(hotelId === 'settings' || hotelId === 'hotel' || hotelId === 'event' || hotelId === 'room' 
    || hotelId === 'hotelSettings' || hotelId === 'eventSettings' || hotelId === 'roomSettings' || hotelId === 'auth'){
        return;
    }

    if (!mongoose.isValidObjectId(hotelId)) {
        return;
    }

    try {
        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).send('Hotel not found');
        }

        const rooms = await Room.find({ hotel: hotel._id, estado: true });
        const roomsWithHotelName = rooms.map(room => ({
            hotel: hotel.name,
            _id: room._id,
            name: room.name,
            available: room.available,
            price: room.price,
            capacity: room.capacity,
            imgUrl: room.imgUrl,
            reservations: room.reservations,   
        }));

        return res.status(200).json({ total: roomsWithHotelName.length, rooms: roomsWithHotelName });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};


// Editar Habitación
export const updateRoom = async (req, res = response) => {
    const { id } = req.params;
    const { _id, ...rest } = req.body;

    if (!id) {
        return res.status(400).json({ msg: 'Necesita el ID para editar' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(id, rest, { new: true });

    if (!updatedRoom) {
        return res.status(404).json({ msg: 'Room not found' });
    }

    res.status(200).json({
        msg: 'Room updated',
        room: updatedRoom
    });
}

// Editar Disponibilidad de Habitación
export const updateRoomAvailability = async (req, res = response) => {
    const { id } = req.params;
    const { available } = req.body;

    if (!id) {
        return res.status(400).json({ msg: 'Necesita el ID para editar la disponibilidad' });
    }

    try {
        const updatedRoom = await Room.findByIdAndUpdate(id, { available }, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ msg: 'Habitación no encontrada' });
        }

        res.status(200).json({
            msg: 'Disponibilidad de habitación actualizada',
            room: updatedRoom
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar la disponibilidad de la habitación' });
    }
}



// Eliminar Habitaciones
export const deleteRoom = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

        const room = await Room.findByIdAndUpdate(
            id,
            { estado: false },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ message: 'Room no encontrado' });
        }

        res.status(200).json({ message: 'Room eliminado correctamente' });
    }
    if (!user) {
        return res
            .status(400)
            .send(`Wrong credentials, ${email} doesn't exists en database`);
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el Room' });
    }
};

export const restoreRoom = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

        const room = await Room.findByIdAndUpdate(
            id,
            { estado: true },
            { new: true }
        );

        if (!room) {
            return res.status(404).json({ message: 'Room no encontrado' });
        }

        res.status(200).json({ message: 'Room eliminado correctamente' });
    }
    if (!user) {
        return res
            .status(400)
            .send(`Wrong credentials, ${email} doesn't exists en database`);
    }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el Room' });
    }
};