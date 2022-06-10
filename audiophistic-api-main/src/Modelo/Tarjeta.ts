import DAO from "../Controlador/DAO";
import { Direccion } from "./Direccion";
import { Tipo_de_Pago } from "./Tipo_de_Pago";

export class Tarjeta extends Tipo_de_Pago {

    base_de_datos: DAO;

    constructor(id_tipo = 1, nombre_tipo = "Tarjeta") {
        super(id_tipo, nombre_tipo);
        this.base_de_datos = DAO.get_instancia();
    }

    async pagar(id_pedido: number, monto_total: number, subtotal: number, costo_envio: number, comprobante: string,
        direccion_pedido: Direccion): Promise<string> {
        return this.base_de_datos.realizar_pago(id_pedido, this.id_tipo, monto_total, subtotal, costo_envio, comprobante,
            direccion_pedido.direccion, direccion_pedido.canton, direccion_pedido.provincia,
            direccion_pedido.cedula, direccion_pedido.telefono, direccion_pedido.nombre_consumidor);
    }
}