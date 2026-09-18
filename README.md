# M8 Blog

Aplicación web de blog desarrollada con Node.js, Express, PostgreSQL, Sequelize y Handlebars. Permite registrar usuarios, iniciar sesión, publicar contenido y administrar comentarios mediante una API REST y vistas web.

## Tecnologías

- Node.js y Express 5
- PostgreSQL
- Sequelize
- Handlebars
- JSON Web Tokens (JWT)
- Bcrypt para el cifrado de contraseñas
- Express FileUpload para avatares

## Requisitos

- Node.js 20 o superior
- PostgreSQL
- Una base de datos disponible para la aplicación

## Instalación

1. Clona el repositorio y entra en su carpeta:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd m8_blog_final
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Crea un archivo `.env.development` en la raíz del proyecto. Puedes usar `.env.example` como referencia:

   ```env
   SECRETO_JWT="una-clave-secreta-segura"
   URI_DATABASE="postgres://usuario:password@localhost:5432/nombre_base_datos"
   ```

   `URI_DATABASE` debe ser una cadena de conexión válida para PostgreSQL. No publiques las credenciales ni la clave JWT.

4. Crea la base de datos en PostgreSQL. El archivo [data/tablas.sql](data/tablas.sql) contiene el esquema de referencia para las tablas `usuarios`, `publicaciones` y `comentarios`.

   Al iniciar, Sequelize conecta con la base de datos y sincroniza los modelos sin modificar la estructura existente (`force: false`, `alter: false`).

## Ejecución

Modo desarrollo, con reinicio automático al detectar cambios:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

El servidor queda disponible en [http://localhost:3000](http://localhost:3000).

## Vistas web

| Ruta | Descripción |
| --- | --- |
| `/` | Página principal con las publicaciones |
| `/publicacion/:id` | Detalle de una publicación y sus comentarios |
| `/login` | Formulario de inicio de sesión |
| `/registro` | Formulario de registro |
| `/nueva-publicacion` | Formulario para crear una publicación |

## API

La API devuelve respuestas JSON. Las rutas protegidas requieren el encabezado:

```http
Authorization: Bearer <TOKEN_JWT>
```

### Autenticación

| Método | Ruta | Protección | Cuerpo |
| --- | --- | --- | --- |
| `POST` | `/auth/registro` | No | `nombre`, `email`, `password`; `avatar` opcional como archivo |
| `POST` | `/auth/login` | No | `email`, `password` |

El token generado durante el login tiene una duración de 5 minutos.

### Usuarios

| Método | Ruta | Protección | Descripción |
| --- | --- | --- | --- |
| `GET` | `/api/usuarios` | No | Lista todos los usuarios |
| `GET` | `/api/usuarios/:id` | No | Obtiene un usuario por ID |
| `GET` | `/api/usuarios/:id/avatar` | No | Obtiene el avatar del usuario |
| `DELETE` | `/api/usuarios/:id` | JWT | Elimina un usuario por ID |

### Publicaciones

| Método | Ruta | Protección | Cuerpo o descripción |
| --- | --- | --- | --- |
| `GET` | `/api/publicaciones` | No | Lista todas las publicaciones |
| `GET` | `/api/publicaciones/:id` | No | Obtiene una publicación y sus comentarios |
| `POST` | `/api/publicaciones` | JWT | `titulo`, `contenido` |

El usuario autor se obtiene del token; no es necesario enviar `usuarioId`.

### Comentarios

| Método | Ruta | Protección | Cuerpo |
| --- | --- | --- | --- |
| `POST` | `/api/comentarios` | JWT | `publicacionId`, `contenido` |
| `DELETE` | `/api/comentarios/:id` | JWT | No requiere cuerpo |

## Ejemplos rápidos

Registrar un usuario:

```bash
curl -X POST http://localhost:3000/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Ana","email":"ana@example.com","password":"secret123"}'
```

Iniciar sesión:

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"secret123"}'
```

Crear una publicación usando el token obtenido:

```bash
curl -X POST http://localhost:3000/api/publicaciones \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN_JWT>" \
  -d '{"titulo":"Mi primera publicación","contenido":"Contenido del artículo"}'
```

## Capturas de pantalla

Las capturas de pantalla del proyecto pueden incorporarse en la carpeta `captures/` y enlazarse desde esta sección:

| Vista | Captura |
| --- | --- |
| Página principal | `captures/home.png` |
| Inicio de sesión | `captures/login.png` |
| Registro de usuario | `captures/registro.png` |
| Nueva publicación | `captures/nueva-publicacion.png` |
| Detalle de publicación | `captures/publicacion.png` |

Cuando los archivos estén disponibles, puedes mostrarlos directamente usando este formato:

```markdown
![Página principal](captures/home.png)
```

## Estructura del proyecto

```text
├── data/                  # Scripts SQL de referencia
├── public/                # Recursos y páginas estáticas
├── src/
│   ├── config/            # Conexión a la base de datos
│   ├── controllers/       # Lógica de autenticación y API
│   ├── middlewares/       # Validación de cuerpos y JWT
│   ├── models/            # Modelos Sequelize y asociaciones
│   ├── routes/             # Rutas web y de la API
│   ├── utils/              # Utilidades, incluido bcrypt
│   └── views/              # Plantillas Handlebars
├── server.js              # Punto de entrada del servidor
├── package.json
└── .env.example           # Ejemplo de variables de entorno
```

## Notas

- Las contraseñas se almacenan usando un hash generado con Bcrypt.
- Los avatares aceptan imágenes JPEG, JPG, WEBP o SVG de hasta 2 MB.
- La aplicación utiliza el puerto `3000` directamente en [server.js](server.js).
- `node_modules` y `.env.development` están excluidos del control de versiones.
