import { Carrito } from "../Modelo/Carrito";
import { Direccion } from "../Modelo/Direccion";
import { Sinpe } from "../Modelo/Sinpe";
import { Tarjeta } from "../Modelo/Tarjeta";
import { Tipo_de_Pago } from "../Modelo/Tipo_de_Pago";
import { Transferencia } from "../Modelo/Transferencia";
import DAO from "./DAO";



export default class Gestor_Pedidos {
    base_datos: DAO;

    constructor() {
        this.base_datos = DAO.get_instancia();
    }

    // Consulta los datos del los tipos de pago disponibles
    consultar_tipos_de_pago(): Promise<{
        id_tipo_pago: number, nombre: string,
        descripcion: string, comprobante: boolean
    }[]> {
        return this.base_datos.consultar_tipos_de_pago();
    }


    //Realizar el checkout
    realizar_checkout(id_usuario: number, carrito: Carrito[], monto_total: number, subtotal: number, costo_envio: number,
        correo: string, direccion_pedido: Direccion): Promise<number> {
        return this.base_datos.realizar_checkout(id_usuario, carrito, monto_total, subtotal,
            costo_envio, correo, direccion_pedido.direccion, direccion_pedido.canton, 
            direccion_pedido.provincia, direccion_pedido.cedula, direccion_pedido.telefono, direccion_pedido.nombre_consumidor)
            .then((id_pedido: number) => {
                return id_pedido;
            })
    }


    // Realiza el pago con un pedido
    realizar_pago(id_pedido: number, id_metodo_pago: number, monto_total: number, subtotal: number, costo_envio: number,
        comprobante: string, direccion_pedido: Direccion): Promise<string> {
        let tipo_pago: Tipo_de_Pago;
        switch (id_metodo_pago) {
            case 1:
                tipo_pago = new Tarjeta();
                break;
            case 2:
                tipo_pago = new Transferencia();
                break;
            case 3:
                tipo_pago = new Sinpe();
                break;
            default:
                throw new Error("El tipo de pago no es válido");
        }

        return tipo_pago.pagar(id_pedido, monto_total, subtotal, costo_envio, comprobante,
            direccion_pedido)
            .then((resultado: string) => {
                return resultado;
            })
    }
}