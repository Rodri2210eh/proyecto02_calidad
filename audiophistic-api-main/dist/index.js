"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Controlador_1 = __importDefault(require("./Controlador/Controlador"));
const Controlador_Acceso_1 = __importDefault(require("./Controlador/Controlador_Acceso"));
let opciones_cors = {
    origin: ['http://186.176.18.72', 'http://localhost:4200'],
    optionsSuccessStatus: 200
};
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(__dirname));
app.use(express_1.default.json({ limit: '10mb' }));
app.use((0, cors_1.default)(opciones_cors));
let controlador = new Controlador_1.default();
let controlador_login = new Controlador_Acceso_1.default();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("LISTENING ON PORT", PORT);
});
app.get('/', (req, res) => {
    res.send('Bienvenido a la api de Audiophistic!');
});
/* Verifica si hay un token en el request */
function hay_auth(req, res) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        throw new Error('Falta el header de autorización');
    }
    ;
    let token = req.headers.authorization.split(' ');
    if (token.length < 2) {
        throw new Error('Falta el token de autorización');
    }
    return token;
}
/* Verifican los diferentes tipos de autorizacion que hay */
function autorizacion_admin(req, res, next) {
    try {
        let token = hay_auth(req, res);
        if (!controlador_login.verificar_permisos(token[1], 1)) {
            return res.send({ error: 'Acceso denegado' });
        }
        else {
            return next();
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
}
function autorizacion_creador_contenido(req, res, next) {
    try {
        let token = hay_auth(req, res);
        if (!controlador_login.verificar_permisos(token[1], 2)) {
            return res.send({ error: 'Acceso denegado' });
        }
        else {
            return next();
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
}
function autorizacion_consumidor(req, res, next) {
    try {
        let token = hay_auth(req, res);
        if (!controlador_login.verificar_permisos(token[1], 3)) {
            return res.send({ error: 'Acceso denegado' });
        }
        else {
            return next();
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
}
// Inicio de sesion, se comunica con el controlador login
app.post('/registrar_usuario', (req, res) => {
    try {
        let { correo, nombre, contrasena } = req.body;
        if (nombre && correo && contrasena) {
            return controlador.registrar_usuario(correo, nombre, contrasena)
                .then((resultado) => {
                return res.send({ resultado });
            }).catch((err) => {
                return res.send({ error: err.message });
            });
        }
        else {
            return res.send({ error: "Los datos están incompletos" });
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});

//Crear usuario, creador de contenido
app.post('/crear_usuario', autorizacion_admin, (req, res) => {
    try {
        var { correo, nombre, caracteristicas } = req.body;
        if (correo && nombre && caracteristicas) {
            return controlador.crear_usuario(correo, nombre, caracteristicas)
                .then((resultado) => {
                return res.send({ resultado });
            }).catch((err) => {
                return res.send({ error: err.message });
            });
        }
        else {
            return res.send({ error: "Los datos están incompletos" });
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
app.post('/confirmar_usuario', (req, res) => {
    try {
        let { token } = req.body;
        if (token) {
            return controlador.confirmar_usuario(token)
                .then((resultado) => {
                return res.send({ resultado });
            }).catch((err) => {
                return res.send({ error: err.message });
            });
        }
        else {
            return res.send({ error: "El token no fue enviado" });
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
// Inicio de sesion, se comunica con el controlador login
app.post('/iniciar_sesion', (req, res) => {
    try {
        let { correo, contrasena } = req.body;
        if (correo && contrasena) {
            return controlador_login.verificar_contrasena(correo, contrasena)
                .then((resultado) => {
                return res.send({ resultado });
            }).catch((err) => {
                return res.send({ error: err.message });
            });
        }
        else {
            return res.send({ error: "Los datos están incompletos" });
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
// Inicio de sesion, se comunica con el controlador login
app.post('/validar_tipo_token', (req, res) => {
    try {
        let { token, id_tipo } = req.body;
        if (token && id_tipo) {
            return controlador_login.validar_tipo(token, parseInt(id_tipo))
                .then((resultado) => {
                return res.send({ resultado });
            }).catch((err) => {
                return res.send({ error: err.message });
            });
        }
        else {
            return res.send({ error: "El token no fue enviado" });
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});

/* Devuelve todos los usuarios, se comunica con el controlador,
    Solo pueden accesar con permisos de administrador */
app.get('/usuarios', autorizacion_admin, (req, res) => {
    try {
        controlador.consultar_usuarios()
            .then((resultado) => {
            return res.send({ resultado });
        }).catch((err) => {
            return res.send({ error: err.message });
        });
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});

/* Devuelve todos los usuarios, se comunica con el controlador,
    Solo pueden accesar con permisos de administrador */
app.get('/usuarios', autorizacion_admin, (req, res) => {
    try {
        controlador.consultar_usuarios()
            .then((resultado) => {
            return res.send({ resultado });
        }).catch((err) => {
            return res.send({ error: err.message });
        });
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});

// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/usuarios/:id_usuario', autorizacion_admin, (req, res) => {
    try {
        let id_usuario = parseInt(req.params.id_usuario);
        controlador.consultar_usuario(id_usuario)
            .then((resultado) => {
            return res.send({ resultado });
        }).catch((err) => {
            return res.send({ error: err.message });
        });
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
//Elimina un usuario
app.get('/eliminar_usuario/:id_usuario', autorizacion_admin, (req, res) => {
    try {
        let id_usuario = parseInt(req.params.id_usuario);
        controlador.eliminar_usuario(id_usuario)
            .then((resultado) => {
            return res.send({ resultado });
        }).catch((err) => {
            return res.send({ error: err.message });
        });
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});

// Inserta un producto y todos sus datos a la base de datos
app.post('/crear_producto', autorizacion_creador_contenido, (req, res) => {
    try {
        let { producto, estilos } = req.body;
        if (producto && estilos) {
            controlador.crear_producto(producto, estilos)
                .then((resultado) => {
                return res.send({ resultado });
            }).catch((err) => {
                return res.send({ error: err.message });
            });
        }
        else {
            return res.send({ error: "Los datos están incompletos" });
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});

/* Devuelve todos los usuarios, se comunica con el controlador,
    Solo pueden accesar con permisos de administrador */
app.get('/productos', autorizacion_admin, (req, res) => {
    try {
        controlador.consultar_productos()
            .then((resultado) => {
            return res.send({ resultado });
        }).catch((err) => {
            return res.send({ error: err.message });
        });
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
//Devuelve todos los productos registrados a un Creador de Contenido
app.get('/productos_por_creador/:id_creador_contenido', (req, res) => {
    try {
        let id_usuario = parseInt(req.params.id_creador_contenido);
        controlador.consultar_productos_creador(id_usuario)
            .then((resultado) => {
            return res.send({ resultado });
        }).catch((err) => {
            return res.send({ error: err.message });
        });
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/productos/:id_producto', (req, res) => {
    try {
        let id_producto = parseInt(req.params.id_producto);
        controlador.consultar_producto(id_producto)
            .then((resultado) => {
            return res.send({ resultado });
        }).catch((err) => {
            return res.send({ error: err.message });
        });
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/estilos/:id_producto', (req, res) => {
    try {
        let id_producto = parseInt(req.params.id_producto);
        controlador.consultar_estilos(id_producto)
            .then((resultado) => {
            return res.send({ resultado });
        }).catch((err) => {
            return res.send({ error: err.message });
        });
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
// Devuelve todos los datos del usuario, se comunica con el controlador
app.get('/eliminar_producto/:id_producto', autorizacion_admin, (req, res) => {
    try {
        let id_producto = parseInt(req.params.id_producto);
        controlador.eliminar_producto(id_producto)
            .then((resultado) => {
            return res.send({ resultado });
        }).catch((err) => {
            return res.send({ error: err.message });
        });
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
// Cambio de contrasena, se comunica con el controlador
app.post('/cambiar_contrasena', (req, res) => {
    try {
        let { token, contrasena } = req.body;
        if (token && contrasena) {
            controlador.cambiar_contrasena(token, contrasena)
                .then((resultado) => {
                return res.send({ resultado });
            })
                .catch((err) => {
                return res.send({ error: err.message });
            });
        }
        else {
            return res.send({ error: "Los datos están incompletos" });
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
// Envio de correo con contrasena temporal
app.post('/recuperar_contrasena', (req, res) => {
    try {
        let { correo } = req.body;
        if (correo) {
            controlador.crear_contrasena_temporal(correo)
                .then((resultado) => {
                return res.send({ resultado });
            }).catch((err) => {
                return res.send({ error: err.message });
            });
        }
        else {
            return res.send({ error: "Hubo un error" });
        }
    }
    catch (err) {
        return res.send({ error: err.message });
    }
});
