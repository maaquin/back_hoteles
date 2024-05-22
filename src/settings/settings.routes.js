import {Router} from "express";
import { check } from "express-validator";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { getUserSetting, usuariosPut, passwordPatch, usuariosUpdate, getUserSettingSolo } from "./settingsUser.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router()

router.post('/user', getUserSetting)

router.post('/solo', getUserSettingSolo)

router.put('/user',
    [
        check('username','Username is necesary').not().isEmpty(),
        validarCampos
    ], usuariosPut)

router.put('/update',
    [
        validarJWT,
        check('email','The email is necessary').not().isEmpty(),
        validarCampos
    ], usuariosUpdate)

router.patch('/user',
    [
        check('password','The password is necesary').not().isEmpty(),
        check('newPassword','The new password is necesary').not().isEmpty(),
        check('password','Password min 6 max 12').isLength({min:6,max:12}),
        check('newPassword','New password min 6 max 12').isLength({min:6,max:12}),
    ], passwordPatch)



export default router