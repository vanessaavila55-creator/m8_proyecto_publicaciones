import express from "express";
import * as authControllers from "../controllers/auth/index.js";
import validaBody from "../middlewares/validaBody.js";

const router = express.Router();

//REGISTRAR NUEVOS USUARIOS
router.post("/registro", validaBody, authControllers.registroUsuario);

//AUTENTICAR USUARIOS
router.post("/login", validaBody, authControllers.login);

export default router;
