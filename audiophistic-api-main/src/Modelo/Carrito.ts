export interface Carrito {
    id_consumidor:number;
    id_producto:number;
    id_estilo?:number;
    titulo: string;
    nombre_estilo?: string;
    precio: number;
    cantidad:number; 
    imagen: string; 
} 
