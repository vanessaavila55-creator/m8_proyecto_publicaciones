import Usuario from "../../models/Usuario.model.js";

const getAvatarByid= async (req, res) => {
    try {

        let { id } = req.params;

        const usuario = await Usuario.findByPk(id, {
            attributes: ["imagenAvatar", "mimetype"]
        });

        if(!usuario || !usuario.imagenAvatar){
            return res.status(404).send("No existe avatar para usuario id:" + id);
        }

        //LE INDICAMOS AL CLIENTE CÓMO DEBE PROCESAR LA DATA.
        res.set('Content-Type', usuario.mimetype);

        res.send(usuario.imagenAvatar);

    } catch (error) {
        res.status(500).send("Error al cargar avatar");
    }
};

export default getAvatarByid;