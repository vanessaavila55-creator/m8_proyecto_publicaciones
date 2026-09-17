import express from "express";
import Usuario from "../models/Usuario.model.js";
import Publicacion from "../models/Publicacion.model.js";
import Comentario from "../models/Comentario.model.js";
import moment from "moment";

const router = express.Router();

//VISTA HOME
router.get(["/"], async (req, res) => {
    try {
        const { count, rows } = await Publicacion.findAndCountAll({
            include: [
                {
                    model: Usuario,
                    as: "autor",
                    attributes: ["id", "nombre", "email"],
                },
            ],
        });

        const publicaciones = rows.map((p) => {
            p = p.toJSON();
            p.fechaCreacion = moment(p.fechaCreacion).format("DD/MM/YYYY hh:mm:ss a");
            p.fechaActualizacion = moment(p.fechaActualizacion).format("DD/MM/YYYY hh:mm:ss a");
            return p;
        });
        const cantidadPublicaciones = count;

        res.render("home", {
            publicaciones, cantidadPublicaciones
        });
    } catch (error) {
        console.log(error);
        res.render("home");
    }
});

// VISTA DE UNA PUBLICACIÓN
router.get("/publicacion/:id", async (req, res) => {
    try {
        const publicacion = await Publicacion.findByPk(req.params.id, {
            include: [
                {
                    model: Usuario,
                    as: "autor",
                    attributes: ["id", "nombre", "email"],
                },
                {
                    model: Comentario,
                    include: [
                        {
                            model: Usuario,
                            as: "autor",
                            attributes: ["id", "nombre", "email"],
                        },
                    ],
                },
            ],
            order: [[Comentario, "fecha_creacion", "ASC"]],
        });

        if (!publicacion) {
            return res.status(404).render("publicacion", {
                error: "No existe ninguna publicación con ese id.",
            });
        }

        const publicacionData = publicacion.toJSON();
        publicacionData.fechaCreacion = moment(publicacionData.fechaCreacion).format("DD/MM/YYYY hh:mm:ss a");
        publicacionData.fechaActualizacion = moment(publicacionData.fechaActualizacion).format("DD/MM/YYYY hh:mm:ss a");
        publicacionData.comentarios = (publicacionData.comentarios || []).map((comentario) => {
            comentario.fechaCreacion = moment(comentario.createdAt).format("DD/MM/YYYY hh:mm:ss a");
            return comentario;
        });

        return res.render("publicacion", { publicacion: publicacionData });
    } catch (error) {
        console.log(error);
        return res.status(500).render("publicacion", {
            error: "No se pudo cargar la publicación.",
        });
    }

});


router.get("/login", (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        console.log(error);
        res.render("login");
    }
});

router.get("/registro", (req, res) => {
    try {
        res.render("registro");
    } catch (error) {
        console.log(error);
        res.render("registro");
    }
});

router.get("/nueva-publicacion", (req, res) => {
    try {
        res.render("nuevaPublicacion");
    } catch (error) {
        console.log(error);
        res.render("nuevaPublicacion");
    }
});




export default router;
