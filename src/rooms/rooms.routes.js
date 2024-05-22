import { Router } from "express";
import { check } from "express-validator";
import {
    createRoom,
    getRoom,
    getRoomByName,
    getRoomsByHotelId,
    updateRoom,
    updateRoomAvailability,
    deleteRoom,
    getRoomById,
    getBadRoom,
    restoreRoom
} from "./rooms.controller.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarHotelId } from "../middlewares/validar-id.js"
//import { tieneRole } from "../middlewares/validar-roles.js"
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router()

router.post("/", [
    validarJWT,
    check("hotel", "El nombre del hotel es obligatorio").notEmpty(),
    check("name", "El nombre es obligatorio").notEmpty(),
    check("price", "El precio de la habitación es obligatorio").notEmpty(),
    check("capacity", "La capacityPeople de la habitación es obligatorio").notEmpty(),
    // check("reservations.*.startDate", "La fecha de inicio de la reserva es obligatoria").notEmpty(),
    // check("reservations.*.endDate", "La fecha de fin de la reserva es obligatoria").notEmpty(),
    // check("reservations.*.startDate", "La fecha de inicio de la reserva debe ser una fecha válida").custom(value => {
    //     const date = new Date(value);
    //     if (!isNaN(date.getTime())) {
    //         return true;
    //     }
    //     throw new Error("La fecha de inicio de la reserva no es válida");
    // }),
    // check("reservations.*.endDate", "La fecha de fin de la reserva debe ser una fecha válida").custom(value => {
    //     const date = new Date(value);
    //     if (!isNaN(date.getTime())) {
    //         return true;
    //     }
    //     throw new Error("La fecha de fin de la reserva no es válida");
    // }),
    validarCampos
], createRoom);

router.get("/", [
    validarCampos
], getRoom);

router.get("/bad/:id", [
    validarCampos
], getBadRoom);

router.get("/:id", getRoomById);

router.get("/name", [
    validarCampos
], getRoomByName);

router.get("/search/:hotelId", [
    validarCampos,
], getRoomsByHotelId);

router.put("/delete",[
    validarJWT
], deleteRoom);

router.put("/restore",[
    validarJWT
], restoreRoom);

router.put("/:id", [
    validarCampos
], updateRoom);

router.put("/available/:id", [
    check("available", "El estado de disponibilidad es obligatorio").isBoolean(),
    validarCampos
], updateRoomAvailability);


export default router;