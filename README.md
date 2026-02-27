# Express API — Mongoose + TypeScript In Depth

API REST construida con **Node.js**, **Express**, **TypeScript** y **Mongoose** que gestiona dos entidades principales: `Organizacion` y `Usuario`.

---

## Tecnologías

| Paquete | Versión | Uso |
|---|---|---|
| express | ^4.17.3 | Framework HTTP |
| mongoose | ^6.13.9 | ODM para MongoDB |
| joi | ^17.6.0 | Validación de esquemas en peticiones |
| dotenv | ^16.0.0 | Variables de entorno |
| cors | ^2.8.6 | Política de acceso cruzado |
| chalk | ^4.1.2 | Logging con color en consola |
| typescript | ^4.5.5 | Tipado estático (devDependency) |

---

## Estructura del proyecto

```
src/
├── server.ts              # Punto de entrada: conexión a Mongo e inicio del servidor
├── config/
│   └── config.ts          # Configuración de variables de entorno (Mongo + puerto)
├── library/
│   └── Logging.ts         # Utilidad de logging con colores (INFO / WARN / ERROR)
├── middleware/
│   └── Joi.ts             # Validación de payloads con Joi + schemas de cada entidad
├── models/
│   ├── Organizacion.ts    # Esquema/Modelo Mongoose de Organizacion
│   └── Usuario.ts         # Esquema/Modelo Mongoose de Usuario
├── controllers/
│   ├── Organizacion.ts    # Lógica CRUD de Organizacion
│   └── Usuario.ts         # Lógica CRUD de Usuario
└── routes/
    ├── Organizacion.ts    # Definición de rutas de Organizacion
    └── Usuario.ts         # Definición de rutas de Usuario
```

---

## Descripción de cada archivo

### `src/server.ts`
Punto de entrada de la aplicación. Se encarga de:
1. Conectar a MongoDB mediante Mongoose.
2. Si la conexión es exitosa, inicia el servidor HTTP.
3. Registra middlewares globales: logging de peticiones/respuestas, CORS, body parsers.
4. Monta las rutas bajo los prefijos `/organizaciones` y `/usuarios`.
5. Expone un healthcheck en `GET /ping`.
6. Gestiona respuestas 404 para rutas no encontradas.

---

### `src/config/config.ts`
Lee las variables de entorno mediante `dotenv` y exporta el objeto `config` con dos secciones:
- `mongo.url` — URI de conexión a MongoDB.
- `server.port` — Puerto del servidor HTTP (por defecto `1337`).

---

### `src/library/Logging.ts`
Clase estática `Logging` con tres métodos de salida en consola, cada uno con un color diferente gracias a `chalk`:
| Método | Color | Uso |
|---|---|---|
| `Logging.info()` | Azul | Información general |
| `Logging.warning()` | Amarillo | Advertencias |
| `Logging.error()` | Rojo | Errores |

---

### `src/middleware/Joi.ts`
Contiene dos exportaciones:

- **`ValidateJoi(schema)`** — Middleware de orden superior que recibe un esquema Joi, valida el `req.body` y, si falla, devuelve `422 Unprocessable Entity`.
- **`Schemas`** — Objeto con los esquemas de validación de cada entidad:
  - `Schemas.organizacion.create` / `.update` → valida `{ name: string }`.
  - `Schemas.usuario.create` / `.update` → valida `{ name: string, organizacion: ObjectId (24 hex) }`.

---

### `src/models/Organizacion.ts`
Define el modelo Mongoose `Organizacion` con la siguiente estructura:

| Campo | Tipo | Requerido |
|---|---|---|
| `_id` | ObjectId | Sí (auto) |
| `name` | String | Sí |

Interfaces TypeScript exportadas: `IOrganizacion`, `IOrganizacionModel`.

---

### `src/models/Usuario.ts`
Define el modelo Mongoose `Usuario` con la siguiente estructura:

| Campo | Tipo | Requerido | Notas |
|---|---|---|---|
| `_id` | ObjectId | Sí (auto) | |
| `name` | String | Sí | |
| `organizacion` | ObjectId | Sí | Referencia a `Organizacion` |
| `createdAt` | Date | Auto | Generado por `timestamps: true` |
| `updatedAt` | Date | Auto | Generado por `timestamps: true` |

Interfaces TypeScript exportadas: `IUsuario`, `IUsuarioModel`.

---

### `src/controllers/Organizacion.ts`
Implementa las cinco operaciones CRUD sobre la colección `organizaciones`:
- `createOrganizacion` — Crea y guarda una nueva organización.
- `readOrganizacion` — Busca por `_id`.
- `readAll` — Devuelve todas las organizaciones.
- `updateOrganizacion` — Actualiza campos mediante `findById` + `.set()` + `.save()`.
- `deleteOrganizacion` — Elimina mediante `findByIdAndDelete`.

---

### `src/controllers/Usuario.ts`
Implementa las cinco operaciones CRUD sobre la colección `usuarios`:
- `createUsuario` — Crea y guarda un nuevo usuario.
- `readUsuario` — Busca por `_id` y hace **populate** de la organización referenciada.
- `readAll` — Devuelve todos los usuarios.
- `updateUsuario` — Actualiza campos mediante `findById` + `.set()` + `.save()`.
- `deleteUsuario` — Elimina mediante `findByIdAndDelete`.

---

### `src/routes/Organizacion.ts` y `src/routes/Usuario.ts`
Registran los endpoints de cada recurso con sus middlewares de validación Joi correspondientes y delegan la lógica al controlador.

---

## Configuración de MongoDB

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
MONGO_URI="mongodb://localhost:27017/sem1"
SERVER_PORT="1337"
```

La variable crítica es `MONGO_URI`. La base de datos usada por defecto es **`sem1`**.

### Colecciones generadas automáticamente por Mongoose

| Colección | Modelo | Descripción |
|---|---|---|
| `organizacions` | `Organizacion` | Almacena las organizaciones |
| `usuarios` | `Usuario` | Almacena los usuarios con referencia a una organización |

> Mongoose pluraliza el nombre del modelo en minúsculas para nombrar la colección (`Organizacion` → `organizacions`).

---

## Endpoints de la API

El servidor corre en `http://localhost:1337` por defecto.

### General

| Método | URL | Descripción |
|---|---|---|
| `GET` | `/ping` | Healthcheck — devuelve `{ "hello": "world" }` |

---

### Organizaciones — `/organizaciones`

| Método | URL | Body (JSON) | Validación | Descripción | Respuesta éxito |
|---|---|---|---|---|---|
| `POST` | `/organizaciones/create` | `{ "name": "string" }` | Joi required | Crea una nueva organización | `201` |
| `GET` | `/organizaciones/get` | — | — | Lista todas las organizaciones | `200` |
| `GET` | `/organizaciones/get/:organizacionId` | — | — | Obtiene una organización por ID | `200` |
| `PATCH` | `/organizaciones/update/:organizacionId` | `{ "name": "string" }` | Joi required | Actualiza el nombre de una organización | `201` |
| `DELETE` | `/organizaciones/delete/:organizacionId` | — | — | Elimina una organización por ID | `201` |

#### Ejemplo — Crear organización
```http
POST /organizaciones/create
Content-Type: application/json

{
  "name": "Acme Corp"
}
```
Respuesta:
```json
{
  "organizacion": {
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "name": "Acme Corp"
  }
}
```

---

### Usuarios — `/usuarios`

| Método | URL | Body (JSON) | Validación | Descripción | Respuesta éxito |
|---|---|---|---|---|---|
| `POST` | `/usuarios/create` | `{ "name": "string", "organizacion": "ObjectId" }` | Joi required | Crea un nuevo usuario | `201` |
| `GET` | `/usuarios/get` | — | — | Lista todos los usuarios | `200` |
| `GET` | `/usuarios/get/:usuarioId` | — | — | Obtiene un usuario por ID (con populate de organización) | `200` |
| `PATCH` | `/usuarios/update/:usuarioId` | `{ "name": "string", "organizacion": "ObjectId" }` | Joi required | Actualiza los datos de un usuario | `201` |
| `DELETE` | `/usuarios/delete/:usuarioId` | — | — | Elimina un usuario por ID | `201` |

#### Ejemplo — Crear usuario
```http
POST /usuarios/create
Content-Type: application/json

{
  "name": "Joan Puig",
  "organizacion": "64a1b2c3d4e5f6a7b8c9d0e1"
}
```
Respuesta:
```json
{
  "usuario": {
    "_id": "64b2c3d4e5f6a7b8c9d0e1f2",
    "name": "Joan Puig",
    "organizacion": "64a1b2c3d4e5f6a7b8c9d0e1",
    "createdAt": "2026-02-27T10:00:00.000Z",
    "updatedAt": "2026-02-27T10:00:00.000Z"
  }
}
```

#### Ejemplo — Obtener usuario con populate
```http
GET /usuarios/get/64b2c3d4e5f6a7b8c9d0e1f2
```
Respuesta:
```json
{
  "usuario": {
    "_id": "64b2c3d4e5f6a7b8c9d0e1f2",
    "name": "Joan Puig",
    "organizacion": {
      "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
      "name": "Acme Corp"
    },
    "createdAt": "2026-02-27T10:00:00.000Z",
    "updatedAt": "2026-02-27T10:00:00.000Z"
  }
}
```

---

## Códigos de respuesta

| Código | Significado |
|---|---|
| `200` | OK — lectura exitosa |
| `201` | Created / Modified — escritura exitosa |
| `404` | Not Found — recurso no encontrado |
| `422` | Unprocessable Entity — validación Joi fallida |
| `500` | Internal Server Error — error de base de datos |

---

## Instalación y ejecución

```bash
# Instalar dependencias (compila TypeScript automáticamente via postinstall)
npm install

# Iniciar el servidor (ejecuta el build compilado)
npm start
```

> El script `postinstall` ejecuta `tsc` automáticamente, compilando `src/` hacia `build/`.

Para compilar manualmente:
```bash
npx tsc
```
