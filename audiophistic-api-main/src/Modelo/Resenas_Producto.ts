import { Objeto_Calificacion } from "./Objeto_Calificacion";
import { Resena } from "./Resena";

export interface Resenas_Producto extends Resena{
    comentario: string;
    fecha: Date;
    calificaciones: Objeto_Calificacion[];

}