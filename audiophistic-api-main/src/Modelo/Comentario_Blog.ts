import { Resena } from "./Resena";

export interface Comentario_Blog extends Resena{
    id_comentario: number;
    es_autor_actual: boolean;
    comentario: string;

}