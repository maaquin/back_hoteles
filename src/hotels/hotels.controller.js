import Hotel from './hotels.model.js'
import User from "../users/user.model.js";
import Event from '../events/events.model.js'
import Room from '../rooms/rooms.model.js'
import bcryptjs from "bcryptjs";

// Crear un hotel
export const createHotel = async (req, res) => {
    try {
        const { name, location, category, comforts, capacity, imgUrl, coordenadas } = req.body;

        const newHotel = new Hotel({
            name,
            location,
            category,
            comforts,
            capacity,
            imgUrl,
            coordenadas
        });

        const savedHotel = await newHotel.save();

        return res.status(201).json(savedHotel);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

// Obtener todos los hoteles
export const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ estado: true });
        return res.status(200).json(hotels);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const getBadHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find({ estado: false });
        return res.status(200).json(hotels);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

// Obtener un hotel por ID
export const getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findById(id);
        if (!hotel) {
            return res.status(404).send('Hotel not found');
        }
        return res.status(200).json(hotel);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const getHotelByName = async (req, res) => {
    try {
        const { name } = req.body;
        console.log('hotel: ', name)
        const hotel = await Hotel.findOne({ name: name });
        if (!hotel) {
            return res.status(404).send('Hotel not found');
        }
        return res.status(200).json(hotel);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

// Actualizar un hotel por ID
export const updateHotelById = async (req, res) => {
    try {
        const { name, location, category, comforts, capacity, imgUrl, coordenadas, id } = req.body;

        const updatedHotel = await Hotel.findByIdAndUpdate(id, {
            name,
            location,
            category,
            comforts,
            capacity,
            imgUrl,
            coordenadas
        }, { new: true });

        if (!updatedHotel) {
            return res.status(404).send('Hotel not found');
        }

        return res.status(200).json(updatedHotel);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

// Eliminar un hotel por ID
export const deleteHotelById = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

            const deletedHotel = await Hotel.findByIdAndUpdate(
                id,
                { estado: false },
                { new: true }
            );

            if (!deletedHotel) {
                return res.status(404).send('Hotel not found');
            }

            const updateEvents = Event.updateMany(
                { hotel: deletedHotel.name },
                { estado: false }
            );

            const updateRooms = Room.updateMany(
                { hotel: id },
                { estado: false }
            );

            await Promise.all([updateEvents, updateRooms]);

            return res.status(204).send();
        }
        if (!user) {
            return res
                .status(400)
                .send(`Wrong credentials, ${email} doesn't exists en database`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const restoreHotelById = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

            const restoreHotel = await Hotel.findByIdAndUpdate(
                id,
                { estado: true },
                { new: true }
            );

            if (!restoreHotel) {
                return res.status(404).send('Hotel not found');
            }

            const updateEvents = Event.updateMany(
                { hotel: restoreHotel.name },
                { estado: true }
            );

            const updateRooms = Room.updateMany(
                { hotel: id },
                { estado: true }
            );

            await Promise.all([updateEvents, updateRooms]);

            return res.status(204).send();
        }
        if (!user) {
            return res
                .status(400)
                .send(`Wrong credentials, ${email} doesn't exists en database`);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};