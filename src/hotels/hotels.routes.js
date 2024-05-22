import { Router } from "express";
import { check } from "express-validator";

import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

import { createHotel, getAllHotels, getHotelById, updateHotelById, deleteHotelById, getBadHotels, restoreHotelById, getHotelByName } from "./hotels.controller.js";

const router = Router();

export default router;

// Crear un hotel
router.post(
    "/",
    [
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("location", "La ubicación es obligatoria").not().isEmpty(),
        check("category", "La categoría es obligatoria").not().isEmpty(),
        check("comforts", "Los servicios son obligatorios").not().isEmpty(),
        check("capacity", "La capacidad es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    createHotel
);

router.post("/name", getHotelByName)

// Obtener todos los hoteles
router.get("/", getAllHotels);

router.get("/bad", getBadHotels);

// Obtener un hotel por ID
router.get("/:id", getHotelById);

router.put("/delete",[
], deleteHotelById);

router.put("/restore",[
], restoreHotelById);

// Actualizar un hotel por ID
router.put(
    "/edit",
    [
        validarJWT,
        check("name", "El nombre es obligatorio").not().isEmpty(),
        check("location", "La ubicación es obligatoria").not().isEmpty(),
        check("category", "La categoría es obligatoria").not().isEmpty(),
        check("comforts", "Los servicios son obligatorios").not().isEmpty(),
        check("capacity", "La capacidad es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    updateHotelById
);
