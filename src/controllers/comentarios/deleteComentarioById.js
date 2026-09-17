import Comentario from "../../models/Comentario.model.js";
import Publicacion from "../../models/Publicacion.model.js";
import sequelize from "../../config/database.js";

const deleteComentarioById = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { id } = req.params;

        const comentario = await Comentario.findByPk(id, {
            include: [
                {
                    model: Publicacion,
                },
            ],
        });

        if (!req.usuario.admin) {
            if (comentario.usuarioId != req.usuario.id) {
                if (comentario.publicacion.usuarioId != req.usuario.id) {
                    await t.rollback();

                    return res
                        .status(403)
                        .json({
                            status: "fail",
                            message:
                                "Usted no tiene permisos para realizar esta operación.",
                        });
                }
            }
        }

        await comentario.destroy({ transaction: t });

        res.json({
            status: "Ok",
            message: `Comentario eliminado con éxito.`,
        });

        await t.commit();

    } catch (error) {
        await t.rollback();
        res.status(500).json({ status: "error", message: error.message });
    }
};

export default deleteComentarioById;
