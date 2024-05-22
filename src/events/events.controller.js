import { response, request } from "express";
import bcryptjs from "bcryptjs";
import Event from "./events.model.js";
import User from "../users/user.model.js";
import Hotel from '../hotels/hotels.model.js';
import mongoose from 'mongoose';

export const listEvents = async (req, res) => {
    try {
        const events = await Event.find({ estado: true });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const listBadEvents = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findById(id);
        const event = await Event.findOne({hotel: hotel.name, estado: false});
        if (!event) {
            return res.status(404).send('Event not found');
        }
        return res.status(200).json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const getIdEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findOne({_id: id, estado: true});
        if (!event) {
            return res.status(404).send('Event not found');
        }
        return res.status(200).json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const createEvent = async (req, res) => {
    try {
        const { name, description, hotel, capacity, imgUrl, price } = req.body;

        const newEvent = new Event({
            name,
            description,
            hotel,
            capacity,
            imgUrl,
            price
        });

        const createdEvent = await newEvent.save();

        res.status(201).json({ message: "Created Event", createdEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { eventId, name, description, hotel, date, capacity, imgUrl, price } = req.body;

        const updatedEvent = await Event.findByIdAndUpdate(eventId, {
            name,
            description,
            hotel,
            date,
            capacity,
            imgUrl,
            price
        }, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ error: "Event not found" });
        }

        res.status(200).json({ message: "Updated Event", updatedEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

            const deletedEvent = await Event.findByIdAndUpdate(
                id,
                { estado: false },
                { new: true }
            );

            if (!deletedEvent) {
                return res.status(404).json({ error: "Event not found" });
            }

            res.status(200).json({ message: "Deleted Event", deletedEvent });
        } if (!user) {
            return res
                .status(400)
                .send(`Wrong credentials, ${email} doesn't exists en database`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const restoreEvent = async (req, res) => {
    try {
        const { id, email, password } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (user && (await bcryptjs.compare(password, user.password))) {

            const deletedEvent = await Event.findByIdAndUpdate(
                id,
                { estado: true },
                { new: true }
            );

            if (!deletedEvent) {
                return res.status(404).json({ error: "Event not found" });
            }

            res.status(200).json({ message: "Deleted Event", deletedEvent });
        } if (!user) {
            return res
                .status(400)
                .send(`Wrong credentials, ${email} doesn't exists en database`);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const findEventsByHotel = async (req, res) => {
    const { hotelId } = req.params;

    if (hotelId === 'settings' || hotelId === 'hotel' || hotelId === 'event' || hotelId === 'room'
        || hotelId === 'hotelSettings' || hotelId === 'eventSettings' || hotelId === 'roomSettings' || hotelId === 'auth') {
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

        const events = await Event.find({ hotel: hotel.name, estado: true });
        const eventsWithHotelName = events.map(event => ({
            hotel: hotel.name,
            _id: event._id,
            name: event.name,
            capacity: event.capacity,
            price: event.price,
            capacity: event.capacity,
            imgUrl: event.imgUrl,
            reservations: event.reservations,
        }));

        return res.status(200).json({ total: eventsWithHotelName.length, events: eventsWithHotelName });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Something went wrong');
    }
};

export const findEventsByName = async (req, res) => {
    try {
        const name = req.body.name;

        const events = await Event.find({ name: name });

        if (events.length === 0) {
            return res.status(404).json({ message: "No events found for this name" });
        }

        res.status(200).json({ message: `Events for the name ${name}`, events });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};