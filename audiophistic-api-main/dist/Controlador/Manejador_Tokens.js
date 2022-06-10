"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require('dotenv').config();
/* Clase basada en el modelo de Singleton,
   se encarga del manejo de los tokens */
class Manejador_Tokens {
    constructor() {
    }
    static get_instancia() {
        if (!Manejador_Tokens.instancia) {
            Manejador_Tokens.instancia = new Manejador_Tokens();
        }
        return Manejador_Tokens.instancia;
    }
    /* Crea el token del usuario para mantener la sesion
       y seguridad del usuario */
    crear_token(id_usuario, correo, id_tipo) {
        var token = jsonwebtoken_1.default.sign({ id_usuario, correo, caracteristicas: { id_tipo } }, process.env.TOKEN_SECRET);
        return { token };
    }
    /* Crea el token del usuario para poder comprobar el correo
        del usuario */
    crear_token_registro(id) {
        var token = jsonwebtoken_1.default.sign({ id }, process.env.TOKEN_REGISTER_SECRET, { expiresIn: '1 days' });
        return token;
    }
    validar_token(token) {
        try {
            let usuario = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            return (usuario.caracteristicas.id_tipo > 0);
        }
        catch (err) {
            /* Si el token recibido no tiene una firma valida, no puede ser descifrado
               o si el token no contiene lo esperado
               Debe retornar un permiso inexistente */
            return false;
        }
    }
    // Obtiene los datos del token dado
    descifrar_token(token) {
        let usuario;
        try {
            usuario = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        }
        catch (err) {
            /* Si el token recibido no tiene una firma valida, no puede ser descifrado
               o si el token no contiene lo esperado
               Debe retornar un error */
            throw new Error('El token es inválido');
        }
        if (usuario) {
            return usuario;
        }
        else {
            throw new Error('El token es inválido');
        }
    }
    //Verifica que el token sea valido y regresa el id del tipo
    verificar_permisos(token) {
        try {
            let usuario = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            return usuario.caracteristicas.id_tipo;
        }
        catch (err) {
            /* Si el token recibido no tiene una firma valida, no puede ser descifrado
               o si el token no contiene lo esperado
               Debe retornar un permiso inexistente */
            return -1;
        }
    }
    //Verifica que el token sea valido y regresa el id del usuario a activar
    verificar_token_registro(token) {
        try {
            let usuario = jsonwebtoken_1.default.verify(token, process.env.TOKEN_REGISTER_SECRET);
            return usuario.id;
        }
        catch (err) {
            /* Si el token recibido no tiene una firma valida, no puede ser descifrado
               o si el token no contiene lo esperado
               Debe retornar un error */
            throw new Error('El token dado es inválido');
        }
    }
}
exports.default = Manejador_Tokens;
