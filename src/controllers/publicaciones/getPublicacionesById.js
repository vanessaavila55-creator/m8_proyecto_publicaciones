import Publicacion from "../../models/Publicacion.model.js";
import Usuario from "../../models/Usuario.model.js";
import Comentario from "../../models/Comentario.model.js";

const getPublicacionById = async (req, res) => {
    try {

        let { id } = req.params;
        const publicacion = await Publicacion.findByPk(id, {
            attributes: { exclude: ["usuarioId"]},
            include: [
                {
                    model: Usuario,
                    as: "autor",
                    attributes: ["id", "nombre", "email"]
                },
                {
                    model: Comentario,
                    attributes: { exclude: ["publicacionId", "usuarioId"]},
                    include: [
                        {
                            model: Usuario,
                            as: "autor",
                            attributes: ["id", "nombre", "email"]
                        }
                    ]

                }
            ]
        });

        if(!publicacion){
            return res.status(404).json({status: "fail", message: "No existe ninguna publicación con id: " + id});
        }

        res.json({
            status: "Ok",
            publicacion
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", message: error.message });
    }
};

export default getPublicacionById;
