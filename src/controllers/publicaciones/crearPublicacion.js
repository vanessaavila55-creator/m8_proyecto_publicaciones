import Usuario from "../../models/Usuario.model.js";
import sequelize from "../../config/database.js";
import Publicacion from "../../models/Publicacion.model.js";


const crearPublicacion= async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { titulo, contenido } = req.body;
        
        if ( !titulo || !contenido) {
            await t.rollback();

            return res.status(400).json({
                status: "fail",
                message:
                    "No se proprocionan los campos requeridos para crear la publicación. Debe proporcionar los siguientes campos: [titulo, contenido]",
            });
        }

        //CREAR PUBLICACION

        const usuario = req.usuario; // DATOS ACTUALIZADOS Y GUARDOS EN E VERIFY TOKEN
        
        const publicacion = await Publicacion.create(
            {usuarioId: usuario.id, titulo, contenido},
            { transaction: t}
        );

        await t.commit();
        res.status(201).json({
            status: "Ok",
            message: `Publicación creada con éxito con ID: ${publicacion.id}`,
            publicacion
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ status: "error", message: error.message });
    }
};

export default crearPublicacion;