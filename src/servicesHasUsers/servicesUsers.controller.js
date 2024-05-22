import { response, request } from 'express';
import Services from './servicesUsers.model.js';
import Room from '../rooms/rooms.model.js';
import Event from '../events/events.model.js';

export const createService = async (req, res) => {
    const { service, hotel, user, reservations } = req.body;

    try {
        let isServiceUpdated = false;

        const isEvent = await Event.findByIdAndUpdate(service, { available: false }, { new: true });
        if (isEvent) {
            isServiceUpdated = true;
        } else {
            const isRoom = await Room.findByIdAndUpdate(service, { available: false }, { new: true });
            if (isRoom) {
                isServiceUpdated = true;
            }
        }

        if (!isServiceUpdated) {
            console.error('Service not found');
            return res.status(404).json({ msg: 'Service not found' });
        }

        const newService = new Services({ service, hotel, user, reservations });
        await newService.save();

        return res.status(200).json({
            service: newService
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'An error occurred' });
    }
};

export const listServiceId = async (req = request, res = response) => {
    const { id } = req.params;

    try {
        console.log(id);

        const event = await Event.findOne({ estado: true, _id: id });
        console.log(event);

        if (event) {
            return res.status(200).json(event);
        }

        const room = await Room.findOne({ estado: true, _id: id });
        console.log(room);

        if (room) {
            return res.status(200).json(room);
        }

        return res.status(404).json({ error: 'No se encontró el evento o la habitación con el id proporcionado.' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong' });
    }
};


export const listServiceHotel = async (req = request, res = response) => {
    const { id } = req.params;

    console.log(id)

    try {

        const services = await Services.find({ estado: true, hotel: id });
        res.status(200).json(services);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const listServiceUser = async (req = request, res = response) => {
    const { id } = req.params;

    console.log(id)

    try {

        const services = await Services.find({ estado: true, user: id });
        res.status(200).json(services);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const factura = async (req, res) => {
    const { id, extra, total, service } = req.body;

    try {
        let isServiceUpdated = false;

        const isEvent = await Event.findByIdAndUpdate(service, { available: true }, { new: true });
        console.log(isEvent)
        if (isEvent) {
            isServiceUpdated = true;
        } else {
            const isRoom = await Room.findByIdAndUpdate(service, { available: true }, { new: true });
            console.log(isRoom)
            if (isRoom) {
                isServiceUpdated = true;
            }
        }

        if (!isServiceUpdated) {
            console.error('Service not found');
            return res.status(404).json({ msg: 'Service not found' });
        }


        const updatedEvent = await Services.findByIdAndUpdate(id, {
            extra,
            total,
            estado: false
        }, { new: true });

        if (!updatedEvent) {
            return res.status(404).json({ error: "Service not found" });
        }

        res.status(200).json({ updatedEvent });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};