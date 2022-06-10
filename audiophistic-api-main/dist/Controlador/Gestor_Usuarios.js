"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DAO_1 = __importDefault(require("./DAO"));
class Gestor_Usuarios {
    constructor() {
        this.base_datos = DAO_1.default.get_instancia();
    }
    // Registra el usuario con los datos ingresados
    registrar_usuario(correo, nombre, contrasena) {
        return this.base_datos.registrar_usuario(correo, nombre, contrasena)
            .then((id_tipo) => {
            return id_tipo;
        });
    }
    confirmar_usuario(id_usuario) {
        return this.base_datos.confirmar_usuario(id_usuario);
    }
    verificar_usuario(correo) {
        return this.base_datos.verificar_usuario(correo);
    }
    // Crear Usuario Creador de Contenido
    crear_usuario(correo, nombre, contrasena, caracteristicas) {
        return this.base_datos.crear_usuario(caracteristicas.id_tipo, correo, nombre, contrasena, caracteristicas)
            .then((id_tipo) => {
            return id_tipo;
        });
    }
    // Elimina el usuario dado usando el método del DAO
    eliminar_usuario(id_usuairo) {
        return this.base_datos.eliminar_usuario(id_usuairo);
    }
    // Crea el hash y llama a cambiar la contraseña a la base
    cambiar_contrasena(id_usuario, contrasena) {
        return this.base_datos.cambiar_contrasena(id_usuario, contrasena)
            .then((resultado) => {
            return { resultado };
        });
    }
    // Crea el hash y llama a cambiar la contraseña a la base
    cambiar_contrasena_con_correo(correo, contrasena) {
        return this.base_datos.cambiar_contrasena_con_correo(correo, contrasena).then((resultado) => {
            return resultado;
        });
    }
    // Consulta un usuario con su id
    consultar_usuario(id_usuario) {
        return this.base_datos.consultar_usuario(id_usuario)
            .then((usuario) => {
            return usuario;
        });
    }
    //Trae la informacion del grupo de usuarios
    consultar_usuarios() {
        return this.base_datos.consultar_usuarios()
            .then((usuario) => {
            return usuario;
        });
    }
    // Modifica los datos del usuario enviado
    editar_usuario(id_usuairo) {
        return "usuario modificado";
    }
}
exports.default = Gestor_Usuarios;
