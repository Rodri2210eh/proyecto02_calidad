"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DAO_1 = __importDefault(require("./DAO"));
class Gestor_Estilos {
    constructor() {
        this.base_datos = DAO_1.default.get_instancia();
    }
    // Crea el producto con los datos enviados
    crear_estilos(producto) {
        return "producto creado";
    }
    // Obtiene los datos del producto
    consultar_estilos(id_producto) {
        return this.base_datos.consultar_estilos(id_producto)
            .then((producto) => {
            return producto;
        });
    }
    // Modifica los datos del producto enviado, cambia la versión y inserta los nuevos datos según la versión
    editar_estilo(id_producto) {
        return "producto modificado";
    }
}
exports.default = Gestor_Estilos;
