import Usuario from "../../models/Usuario.model.js";
import Publicacion from "../../models/Publicacion.model.js";
import Comentario from "../../models/Comentario.model.js";
import sequelize from "../../config/database.js";


const crearComentario= async (req, res) => {
    const t = await sequelize.transaction();
    try {
        let { publicacionId, contenido } = req.body;
        
        if (!publicacionId|| !contenido) {
            await t.rollback();

            return res.status(400).json({
                status: "fail",
                message:
                    "No se proprocionan los campos requeridos para crear el comentario. Debe proporcionar los siguientes campos: [publicacionId, contenido]",
            });
        }

        //VALIDAR SI EXISTE LA PUBLICACIÓN
        const publicacion = await Publicacion.findByPk(publicacionId, { transaction: t});

        if(!publicacion){
            await t.rollback();
            return res.status(404).json({status: "fail", message: "No existe ninguna publicación con id: " + publicacionId});
        }

        //CREAR COMENTARIO

        const usuario = req.usuario;

        const comentario = await Comentario.create(
            {usuarioId: usuario.id, publicacionId, contenido},
            { transaction: t}
        );

        await t.commit();
        res.status(201).json({
            status: "Ok",
            message: `Comentario creado con éxito, ID: ${comentario.id}`,
        });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ status: "error", message: error.message });
    }
};

export default crearComentario;