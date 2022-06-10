"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DAO_1 = __importDefault(require("./DAO"));
class Gestor_Prodcuctos {
    constructor() {
        this.base_datos = DAO_1.default.get_instancia();
    }
    // Crea el producto con los datos enviados

    crear_producto(producto, estilos) {
        // Revisa si los datos opcionales están completos
        if (producto.fecha_lanzamiento && producto.tiempo_envio && producto.descripcion)
            return this.base_datos.crear_producto(producto.id_creador, producto.caracteristicas.id_tipo, producto.fecha_lanzamiento, producto.titulo, producto.precio, producto.tiempo_envio, producto.descripcion, estilos)
                .then((resultado) => {
                return resultado;
            });
        else {
            throw new Error("Los datos están incompletos");
        }
    }
    // Consulta todos los productos activos
    consultar_productos() {
        return this.base_datos.consultar_productos()
            .then((producto) => {
            return producto;
        });
    }
    // Obtiene los datos del producto
    consultar_producto(id_producto) {
        return this.base_datos.consultar_producto(id_producto)
            .then((producto) => {
            return producto;
        });
    }
    // Elimina el producto dado
    eliminar_producto(id_producto) {
        return this.base_datos.eliminar_producto(id_producto);
    }
    //Obtiene productos de un creador de contenido segun su ID
    consultar_productos_creador(id_creador_contenido) {
        return this.base_datos.consultar_productos_creador(id_creador_contenido)
            .then((producto) => {
            return producto;
        });
    }
    // Modifica los datos del producto enviado, cambia la versión y inserta los nuevos datos según la versión
    editar_producto(id_producto) {
        return "producto modificado";
    }
}
exports.default = Gestor_Prodcuctos;
