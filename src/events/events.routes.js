import { Router } from "express";
import { check } from "express-validator";
import { listEvents, createEvent, updateEvent, deleteEvent, findEventsByHotel, findEventsByName, getIdEvent, listBadEvents, restoreEvent } from "./events.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarHotelId } from "../middlewares/validar-id.js"
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router()

router.post(
    "/",
    [
        validarJWT,
        check("name", "The name is required").not().isEmpty(),
        check("description", "Description is required").not().isEmpty(),
        check("hotel", "The hotel is required").not().isEmpty(),
        check("capacity", "Capacity is required").not().isEmpty(),
        validarCampos
    ], createEvent);

router.get("/", listEvents);

router.get("/bad/:id", listBadEvents);

router.get("/:id", getIdEvent);

router.put("/delete",[
    validarJWT
], deleteEvent);

router.put("/restore",[
    validarJWT
], restoreEvent);

router.put("/",[
    validarJWT,
], updateEvent);

router.get("/search/:hotelId", [
], findEventsByHotel);

router.post("/name", findEventsByName);

export default router;