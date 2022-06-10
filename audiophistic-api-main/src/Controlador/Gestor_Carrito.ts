import { Carrito } from "../Modelo/Carrito";
import { Pedido } from "../Modelo/Pedido";
import DAO from "./DAO";

export default class Gestor_Carrito {
    base_datos: DAO;

    constructor() {
        this.base_datos = DAO.get_instancia();
    }

    // Agregar el contenido del carrito
    agregar_al_carrito(id_usuario: number, id_producto: number, id_estilo: number, cantidad: number): Promise<string> {
        return this.base_datos.agregar_al_carrito(id_usuario, id_producto, id_estilo, cantidad)
            .then((producto: string) => {
                return producto;
            })
    }

    // Cambia la cantidad de un producto del carrito
    cambiar_cantidad_carrito(id_usuario: number, id_producto: number, id_estilo: number, cantidad: number): Promise<string> {
        return this.base_datos.cambiar_cantidad_carrito(id_usuario, id_producto, id_estilo, cantidad)
            .then((producto: string) => {
                return producto;
            })
    }

    // Eliminar el contenido del carrito
    eliminar_del_carrito(id_usuario: number, id_producto: number, id_estilo: number): Promise<string> {
        return this.base_datos.eliminar_del_carrito(id_usuario, id_producto, id_estilo)
            .then((producto: string) => {
                return producto;
            })
    }

    // Thumbnail el contenido del carrito
    thumbnail_carrito(id_usuario: number): Promise<{ cambiado: boolean, carrito: Carrito[] }> {
        return this.base_datos.thumbnail_carrito(id_usuario)
            .then((producto: { cambiado: boolean, carrito: Carrito[] }) => {
                return producto;
            })
    }

    // Consulta el contenido del carrito
    consultar_carrito(id_usuario: number): Promise<{ cambiado: boolean, carrito: Carrito[] }> {
        return this.base_datos.consultar_carrito(id_usuario)
            .then((producto: { cambiado: boolean, carrito: Carrito[] }) => {
                return producto;
            })
    }

    
}