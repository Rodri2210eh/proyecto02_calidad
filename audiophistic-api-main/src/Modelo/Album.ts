import { Tipo_Producto } from "./Tipo_Producto";

export interface Album extends Tipo_Producto{
    generos: string[];
    artista: string[];
    titulo: string[];
}