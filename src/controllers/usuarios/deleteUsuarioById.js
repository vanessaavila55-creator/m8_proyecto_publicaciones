import Usuario from "../../models/Usuario.model.js";
import sequelize from "../../config/database.js";

const deleteUsuariosById = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { id } = req.params;

        if (!req.usuario.admin) {
            if (id != req.usuario.id) {
                await t.rollback();
                return res
                    .status(403)
                    .json({
                        status: "fail",
                        message:
                            "Usted no tiene permisos para realizar la operación.",
                    });
            }
        }

        await Usuario.destroy({ where: { id }, transaction: t });

        await t.commit();
        res.json({
            status: "Ok",
            message: `Usuario eliminado con éxito.`,
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ status: "error", message: error.message });
    }
};

export default deleteUsuariosById;
