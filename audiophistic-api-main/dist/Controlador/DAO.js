"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
require('dotenv').config();
const connection = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: 5432,
    ssl: { rejectUnauthorized: false }
};
/*Clase basada en el modelo de Singleton,
  se encarga de la conexion a la base de datos de postgres */
class DAO {
    constructor() {
        this.cliente = new pg_1.Client(connection);
        try {
            this.cliente.connect();
        }
        catch (err) {
            console.log(err);
        }
    }
    static get_instancia() {
        if (!DAO.instancia) {
            DAO.instancia = new DAO();
        }
        return DAO.instancia;
    }
    // Comprueba que el tipo de usuario exista
    existe_tipo_usuario(id_tipo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from existe_tipo_usuario($1)', [id_tipo]);
                if (res) {
                    return res.rows[0].existe_tipo_usuario;
                }
                else {
                    throw new Error("No se pudo verificar el tipo");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Registra a un usuario CONSUMIDOR
    registrar_usuario(correo, nombre, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from registrar_usuario($1,$2,$3)', [correo, nombre, contrasena]);
                if (res.rows[0]) {
                   return res.rows[0].registrar_usuario;
                }
                else {
                    throw new Error("No se pudo resgistrar al usuario");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    //se crea un usuario consumidor
    crear_usuario(tipo_usuario, correo, nombre, contrasena, caracteristicas) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from crear_usuario($1,$2,$3,$4,$5)', [tipo_usuario, correo, nombre, contrasena, caracteristicas]);
                if (res.rows[0]) {
                    return res.rows[0].crear_usuario;
                }
                else {
                    throw new Error("No Se pudo registrar al usuario");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Reemplaza la contrasena de un usuario pero con mail en lugar de ID
    cambiar_contrasena_con_correo(correo, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from cambiar_contrasena($1,$2)', [correo, contrasena]);
                if (res.rows[0].cambiar_contrasena) {
                    return res.rows[0].cambiar_contrasena;
                }
                else {
                    throw new Error("La contraseña no pudo ser cambiada");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Confirma un usuario CONSUMIDOR
    confirmar_usuario(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from confirmar_usuario($1)', [id_usuario]);
                if (res) {
                    return res.rows[0].confirmar_usuario;
                }
                else {
                    throw new Error("No se pudo confirmar al usuario");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Recupera a un usuario segun su correo
    verificar_usuario(correo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from verificar_usuario($1)', [correo]);
                if (res.rows[0]) {
                    return res.rows[0];
                }
                else {
                    throw new Error("No se pudo obtener el usuario");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Reemplaza la contrasena de un usuario
    cambiar_contrasena(id_usuario, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from cambiar_contrasena($1::int,$2::character varying(60))', [id_usuario, contrasena]);
                if (res.rows[0].cambiar_contrasena) {
                    return res.rows[0].cambiar_contrasena;
                }
                else {
                    throw new Error("La contraseña no pudo ser cambiada");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Recupera todos los usuarios confirmados y activos
    consultar_usuarios() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from consultar_usuarios()');
                if (res.rows[0]) {
                    return res.rows;
                }
                else {
                    throw new Error("No se pudieron obtener los usuarios");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Recupera un usuario y sus datos segun su id
    consultar_usuario(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from consultar_usuario($1)', [id_usuario]);
                if (res.rows[0]) {
                    return res.rows[0];
                }
                else {
                    throw new Error("El usuario no existe, no ha sido confirmado o fue eliminado");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Crea un producto con los datos dados
    crear_producto(id_creador, id_tipo, fecha_lanzamiento, titulo, precio, tiempo_envio, descripcion, estilos) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from crear_producto($1, $2, $3, $4, $5, $6, $7, $8)', [id_creador, id_tipo, fecha_lanzamiento, titulo, precio, tiempo_envio, descripcion, estilos]);
                console.log(res);
                if (res.rows[0]) {
                    return res.rows[0].crear_producto;
                }
                else {
                    throw new Error("No se pudo insertar el producto");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Recupera todos los productos activos
    consultar_productos() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from consultar_productos()');
                if (res.rows[0]) {
                    return res.rows;
                }
                else {
                    throw new Error("No se pudieron obtener los productos");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Recupera un producto y sus datos segun su id
    consultar_producto(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from consultar_producto($1)', [id_producto]);
                if (res.rows[0]) {
                    return res.rows[0];
                }
                else {
                    throw new Error("El producto no existe o fue eliminado");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    //Consulta los productos de un Creador de Contenido segun su ID
    consultar_productos_creador(id_creador_contenido) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from consultar_productos_por_creador($1)', [id_creador_contenido]);
                if (res.rows[0]) {
                    return res.rows;
                }
                else {
                    throw new Error("El cliente no se puede acceder");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Cambia el estado de un usuario a inactivo
    eliminar_producto(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from eliminar_producto($1)', [id_usuario]);
                if (res.rows[0]) {
                    return res.rows[0].eliminar_producto;
                }
                else {
                    throw new Error("El producto no pudo ser eliminado");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Eliminación de usuario. Este es un borrado lógico y NO físico. 
    eliminar_usuario(id_usuario) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from eliminar_usuario($1)', [id_usuario]);
                if (res.rows[0]) {
                    return ("El usuario ha sido desactivado");
                }
                else {
                    throw new Error("el usuario no se ha podido eliminar");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    // Recupera un producto y sus datos segun su id
    consultar_estilos(id_producto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let res = yield this.cliente.query('select * from consultar_estilos_producto($1)', [id_producto]);
                if (res.rows[0]) {
                    return res.rows;
                }
                else {
                    throw new Error("El producto no existe o fue eliminado");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.default = DAO;
