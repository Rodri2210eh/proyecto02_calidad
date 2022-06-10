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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Manejador_Tokens_1 = __importDefault(require("./Manejador_Tokens"));
const Gestor_Usuarios_1 = __importDefault(require("./Gestor_Usuarios"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const DAO_1 = __importDefault(require("./DAO"));
/* Se encarga de verificar el inicio de sesion y los
   Y los permisos que tiene un usuario para ciertas acciones */
class Controlador_Acceso {
    constructor() {
        this.manejador_token = Manejador_Tokens_1.default.get_instancia();
        this.gestor_usuarios = new Gestor_Usuarios_1.default();
        this.base_datos = DAO_1.default.get_instancia();
    }
    /* Verifica la combinación del correo con la contraseña
       Devuelve un token y el id del tipo del usuario en caso de ser correctos los datos*/
    verificar_contrasena(correo, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            let datosUsuario = yield this.gestor_usuarios.verificar_usuario(correo);
            let misma_contrasena = yield bcrypt_1.default.compare(contrasena, datosUsuario.contrasena);
            if (misma_contrasena) {
                return Object.assign({ id_tipo: datosUsuario.caracteristicas.id_tipo }, this.crear_token(datosUsuario.id_usuario, datosUsuario.correo, datosUsuario.caracteristicas.id_tipo));
            }
            else {
                throw new Error("La contraseña es incorrecta");
            }
        });
    }
    // Genera un token con los datos del usuario
    crear_token(id_usuario, correo, id_tipo) {
        return this.manejador_token.crear_token(id_usuario, correo, id_tipo);
    }
    validar_token(token) {
        return this.manejador_token.validar_token(token);
    }
    /* Comprueba que permiso enviado exista
       Y que el token tenga el mismo permiso que el enviado*/
    validar_tipo(token, permiso) {
        return this.base_datos.existe_tipo_usuario(permiso)
            .then(() => {
            if (this.verificar_permisos(token, permiso)) {
                return 'El usuario tiene los permisos dados';
            }
            throw new Error('El usuario no tiene los permisos dados');
        });
    }
    // Comprueba que el token tenga el mismo permiso que el enviado
    verificar_permisos(token, permiso) {
        return this.manejador_token.verificar_permisos(token) === permiso;
    }
}
exports.default = Controlador_Acceso;
