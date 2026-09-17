import express from "express";
import * as publicacionesControllers from "../controllers/publicaciones/index.js";
import validaBody from "../middlewares/validaBody.js";
import verifyToken from "../middlewares/verifyToken.js";

const router = express.Router();

//OBTENER TODAS LAS PUBLICACIONES
router.get("/", publicacionesControllers.getPublicaciones);

//OBTENER ublicacionesControllerd POR ID
router.get("/:id", publicacionesControllers.getPublicacionById);

//CREAR PUBLICACIÓN
router.post("/", validaBody, verifyToken,  publicacionesControllers.crearPublicacion);


export default router;
