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
const DAO_1 = __importDefault(require("./DAO"));
const Manejador_Tokens_1 = __importDefault(require("./Manejador_Tokens"));
const bcrypt = require('bcrypt');
class Controlador_login {
    constructor() {
        this.base_datos = DAO_1.default.get_instancia();
        this.manejador_token = Manejador_Tokens_1.default.get_instancia();
    }
    verificar_contrasena(correo, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            let datosUsuario = yield this.base_datos.verificar_usuario(correo);
            let misma_contrasena = yield bcrypt.compare(contrasena, datosUsuario.contrasena);
            if (misma_contrasena) {
                return this.crear_token(datosUsuario.id_usuario, datosUsuario.email, datosUsuario.id_tipo);
            }
            else {
                throw new Error("La contraseña es incorrecta");
            }
        });
    }
    crear_token(id_usuario, correo, id_tipo) {
        return this.manejador_token.crear_token(id_usuario, correo, id_tipo);
    }
    verificar_token(bearer) {
        return this.manejador_token.descifrar_token(bearer.split(' ')[1]);
    }
}
exports.default = Controlador_login;
