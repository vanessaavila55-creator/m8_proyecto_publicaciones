import express from "express";
import authRoutes from "./routes/auth.routes.js";
import fileUpload from "express-fileupload";
import { create } from  "express-handlebars";
import usuariosRoutes from "./routes/usuarios.routes.js";
import publicacionesRoutes from "./routes/publicaciones.routes.js";
import comentariosRoutes from "./routes/comentarios.routes.js";
import viewsRoutes from "./routes/views.routes.js";

const app = express();

import * as path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//INICIO CONFIGURACIÓN HANDLEBARS

const hbs = create({
	partialsDir: [
		path.join(__dirname, "/views/partials/"),
	],
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));


//FIN CONFIGUCACIÓN HANDLEBARS

//MIDDLEWARES GLOBALES
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload()); // -> req.files 

//establecer public como carpeta pública
//app.use(express.static("public"));


//RUTAS DE 

app.use("/", viewsRoutes);

//RUTAS DE AUTENTICACIÓN (registro de usuarios / login)
app.use("/auth", authRoutes);

//RUTAS DE LA API
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/publicaciones", publicacionesRoutes);
app.use("/api/comentarios", comentariosRoutes);


export default app;