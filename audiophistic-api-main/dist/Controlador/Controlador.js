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
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const generate_password_1 = __importDefault(require("generate-password"));
const Gestor_Usuarios_1 = __importDefault(require("./Gestor_Usuarios"));
const Gestor_Productos_1 = __importDefault(require("./Gestor_Productos"));
const Enviador_Correos_1 = __importDefault(require("./Enviador_Correos"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Manejador_Tokens_1 = __importDefault(require("./Manejador_Tokens"));
const Gestor_Estilos_1 = __importDefault(require("./Gestor_Estilos"));
/* Se encarga de coordinar las funcionalidades
   De la pagina web con sus clases respectivas*/
class Controlador {
    constructor() {
        //El numero de salts para el hash
        this.salts = 10;
        this.envio_correos = Enviador_Correos_1.default.get_instancia();
        this.manejador_token = Manejador_Tokens_1.default.get_instancia();
        this.gestor_productos = new Gestor_Productos_1.default();
        this.gestor_usuarios = new Gestor_Usuarios_1.default();
        this.gestor_estilos = new Gestor_Estilos_1.default();
    }
    // Registra a un consumidor
    registrar_usuario(correo, nombre, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            //Genera el hash y guarda al usuario en la base de datos
            let hash = bcrypt_1.default.hashSync(contrasena, this.salts);
            let id = yield this.gestor_usuarios.registrar_usuario(correo, nombre, hash);
            //Genera el token y lo adjunta al correo
            let token = this.manejador_token.crear_token_registro(id);
            let link = `http://localhost:4200/cuenta?token=${token}`;
            console.log(token, link);
            let cuerpo_correo = fs_1.default.readFileSync('assets/html/correo_activar.html', { encoding: 'utf8', flag: 'r' });
            cuerpo_correo = util_1.default.format(cuerpo_correo, link, link, link);
            return this.envio_correos.enviar_correo(correo, 'Confirmar cuenta — Audiophistic', cuerpo_correo);
        });
    }
    //crear usuario Creador de Contenido
    crear_usuario(correo, nombre, caracteristicas) {
        return __awaiter(this, void 0, void 0, function* () {
            //genera una constrasenia, hash y registra al usuario en una BD
            let contrasena = this.generacion_contrasena();
            let hash = bcrypt_1.default.hashSync(contrasena, this.salts);
            let id = yield this.gestor_usuarios.crear_usuario(correo, nombre, hash, caracteristicas);
            //Envia el correo con la contrasena
            let cuerpo_correo = fs_1.default.readFileSync('assets/html/correo_recuperar.html', { encoding: 'utf8', flag: 'r' });
            cuerpo_correo = util_1.default.format(cuerpo_correo, contrasena);
            return this.envio_correos.enviar_correo(correo, 'Confirmar cuenta de Usuario  — Audiophistic', cuerpo_correo);
            return "string";
        });
    }
    descifrar_token(token) {
        return this.manejador_token.descifrar_token(token);
    }
    //Genera la confirmacion del correo
    confirmar_usuario(token) {
        let id_usuario = this.manejador_token.verificar_token_registro(token);
        return this.gestor_usuarios.confirmar_usuario(id_usuario);
    }
    // Crea el producto con los datos enviados
    crear_producto(producto, estilos) {
        return this.gestor_productos.crear_producto(producto, estilos);
    }
    // Consulta todos los productos
    consultar_productos() {
        return this.gestor_productos.consultar_productos();
    }
    // Consulta los datos del producto respectivo
    consultar_producto(id_producto) {
        return this.gestor_productos.consultar_producto(id_producto);
    }
    // Consulta los datos del producto respectivo
    eliminar_producto(id_producto) {
        return this.gestor_productos.eliminar_producto(id_producto);
    }
    // Consulta los estilos de un producto dado
    consultar_estilos(id_producto) {
        return this.gestor_estilos.consultar_estilos(id_producto);
    }
    // Consulta todos los usuarios
    consultar_usuarios() {
        return this.gestor_usuarios.consultar_usuarios();
    }
    // Consulta los datos del usuario
    consultar_usuario(id_usuario) {
        return this.gestor_usuarios.consultar_usuario(id_usuario);
    }
    //Consulta los productos de un Creador de Contenido segun su ID
    consultar_productos_creador(id_creador_contenido) {
        return this.gestor_productos.consultar_productos_creador(id_creador_contenido);
    }
    //Elimina de forma logica el usuario dado
    eliminar_usuario(id_usuario) {
        return this.gestor_usuarios.eliminar_usuario(id_usuario);
    }
    // Cambia la contrasena del usuario con los datos dados
    cambiar_contrasena(token, contrasena) {
        return __awaiter(this, void 0, void 0, function* () {
            let descifrado = this.descifrar_token(token);
            let hash = bcrypt_1.default.hashSync(contrasena, this.salts);
            return this.gestor_usuarios.cambiar_contrasena(descifrado.id_usuario, hash);
        });
    }
    // Crea una nueva contrasena, la guarda y envia un correo con la contrasena
    crear_contrasena_temporal(correo) {
        return __awaiter(this, void 0, void 0, function* () {
            var contrasena_temporal = this.generacion_contrasena();
            // Guarda la contrasena temporal en la base
            let hash = bcrypt_1.default.hashSync(contrasena_temporal, this.salts);
            yield this.gestor_usuarios.cambiar_contrasena_con_correo(correo, hash);
            // Integra la nueva contrasena al correo y lo envia
            var cuerpo_correo = fs_1.default.readFileSync('./assets/html/correo_recuperar.html', { encoding: 'utf8', flag: 'r' });
            cuerpo_correo = util_1.default.format(cuerpo_correo, contrasena_temporal);
            return this.envio_correos.enviar_correo(correo, "Contraseña Temporal — Audiophistic", cuerpo_correo);
        });
    }
    // Funcion para generar un string aleatorio para la recuperacion de contrasenias
    generacion_contrasena() {
        return generate_password_1.default.generate({
            length: 10,
            symbols: true,
            numbers: true,
            strict: true
        });
    }
}
exports.default = Controlador;
