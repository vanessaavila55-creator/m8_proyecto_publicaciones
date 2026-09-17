import Usuario from "../../models/Usuario.model.js";

const getUsuariosById= async (req, res) => {
    try {

        let { id } = req.params;

        let usuario = await Usuario.findByPk(id, {
            attributes: ["id", "nombre", "email", "mimetype"]
        });

        
        usuario = usuario.toJSON();
        usuario.urlImagen = usuario.mimetype ? `/api/usuarios/${usuario.id}/avatar` : null;
        delete usuario.mimetype;

        res.json({
            status: "Ok",
            usuario,
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
};

export default getUsuariosById;