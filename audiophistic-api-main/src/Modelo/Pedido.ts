import { Tipo_de_Pago } from "./Tipo_de_Pago";
export interface Pedido{
    ip_pedido: number;
    id_consumidor?: number;
    pagado?: boolean;
    precio?: number;
    subtotal?: number;
    costo_envio?: number;
    comprobante?: string;
    tipo_de_pago?: Tipo_de_Pago;
}