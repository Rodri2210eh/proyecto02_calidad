import { Tipo_Producto } from "./Tipo_Producto";

export interface Parlante extends Tipo_Producto{
    marca: string[];
    conexion: string[];
    tipo: string[];
}