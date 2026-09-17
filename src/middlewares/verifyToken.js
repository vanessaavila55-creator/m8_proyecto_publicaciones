import jwt from "jsonwebtoken";

import Usuario from "../models/Usuario.model.js";

const verifyToken = (req, res, next) => {
    try {
        if (!req.headers || !req.headers.authorization) {
            return res.status(401).json({
                status: "fail",
                message:
                    "No se proporciona token, primero debe autenticarse en la aplicacón.",
            });
        }

        let token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, process.env.SECRETO_JWT, async (error, decoded) => {
            if (error) {
                return res
                    .status(401)
                    .json({
                        status: "fail",
                        message:
                            "Autenticación fallida, token fallido o caducado.",
                    });
            }

            const usuario = await Usuario.findByPk(decoded.id);

            if (!usuario) {
                return res
                    .status(404)
                    .json({
                        status: "fail",
                        message: "No se pudo encontrar la cuenta asociada."
                    });
            }
            
            //Opcional: prohibir acceso a usuarios inactivos

            req.usuario = {
                id: usuario.id,
                nombre: usuario.nombre,
                admin: usuario.admin,
                status: usuario.status
            }

            next();
        });
    } catch (error) {
        console.log(error);

        return res
            .status(500)
            .json({ status: "Error", message: "Error interno del servidor." });
    }
};

export default verifyToken;
