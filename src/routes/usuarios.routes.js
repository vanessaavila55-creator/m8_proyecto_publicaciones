import express from "express";
import * as usuariosControllers from "../controllers/usuarios/index.js";
//import validaBody from "../middlewares/validaBody.js";
import verifyToken from "../middlewares/verifyToken.js";


const router = express.Router();

//OBTENER TODOS LOS USUARIOS
router.get("/", usuariosControllers.getUsuarios);

//OBTENER USUARIOS POR SU ID
router.get("/:id", usuariosControllers.getUsuariosById);


//OBTENER AVATAR USUARIO POR SU ID
router.get("/:id/avatar", usuariosControllers.getAvatarByid);


//ELIMINAR USUARIOS POR SU ID
router.delete("/:id", verifyToken, usuariosControllers.deleteUsuariosById);

export default router;
